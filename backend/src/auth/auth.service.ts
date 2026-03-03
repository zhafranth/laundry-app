import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginOwnerDto } from './dto/login-owner.dto';
import { LoginStaffDto } from './dto/login-staff.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtPayload } from './strategies/jwt.strategy';

interface RequestMeta {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private generateRawToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(raw: string): string {
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  private async createSession(
    userType: 'owner' | 'staff',
    userRefId: string,
    meta: RequestMeta,
  ) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const rawRefresh = this.generateRawToken();
    const hashedRefresh = this.hashToken(rawRefresh);

    const session = await this.prisma.session.create({
      data: {
        userType,
        userRefId,
        refreshToken: hashedRefresh,
        deviceInfo: meta.userAgent?.slice(0, 300) ?? null,
        ipAddress: meta.ip?.slice(0, 50) ?? null,
        isActive: true,
        lastActiveAt: now,
        expiresAt,
      },
    });

    return { session, rawRefresh };
  }

  private signAccessToken(payload: JwtPayload): string {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret') ?? 'access-secret',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: (this.config.get<string>('jwt.accessExpiresIn') ?? '15m') as any,
    });
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const rawToken = this.generateRawToken();
    const hashedToken = this.hashToken(rawToken);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        verifyEmailToken: hashedToken,
        verifyEmailExpires: expires,
      },
    });

    this.logger.log(
      `[VERIFY EMAIL] User ${user.email} — token: ${rawToken}`,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  // ─── Verify Email ─────────────────────────────────────────────────────────

  async verifyEmail(dto: VerifyEmailDto) {
    const hashedToken = this.hashToken(dto.token);

    const user = await this.prisma.user.findFirst({
      where: { verifyEmailToken: hashedToken },
    });

    if (!user) {
      throw new BadRequestException('Token tidak valid');
    }

    if (!user.verifyEmailExpires || user.verifyEmailExpires < new Date()) {
      throw new BadRequestException('Token sudah kadaluarsa');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyEmailToken: null,
        verifyEmailExpires: null,
      },
    });

    return { message: 'Email berhasil diverifikasi' };
  }

  // ─── Login Owner ──────────────────────────────────────────────────────────

  async loginOwner(dto: LoginOwnerDto, meta: RequestMeta) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email belum diverifikasi');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    const { session, rawRefresh } = await this.createSession('owner', user.id, meta);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = {
      sub: user.id,
      type: 'owner',
      sessionId: session.id,
    };

    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: rawRefresh,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: 'owner',
      },
    };
  }

  // ─── Login Staff ──────────────────────────────────────────────────────────

  async loginStaff(dto: LoginStaffDto, meta: RequestMeta) {
    const staff = await this.prisma.staff.findFirst({
      where: { outletId: dto.outletId, username: dto.username },
    });

    if (!staff || !(await bcrypt.compare(dto.pin, staff.pinHash))) {
      throw new UnauthorizedException('Username atau PIN salah');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Akun staff tidak aktif');
    }

    const { session, rawRefresh } = await this.createSession('staff', staff.id, meta);

    await this.prisma.staff.update({
      where: { id: staff.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = {
      sub: staff.id,
      type: 'staff',
      outletId: staff.outletId,
      sessionId: session.id,
    };

    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: rawRefresh,
      user: {
        id: staff.id,
        name: staff.name,
        username: staff.username,
        role: staff.role,
        outletId: staff.outletId,
        type: 'staff',
      },
    };
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refresh(dto: RefreshDto) {
    const hashedToken = this.hashToken(dto.refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken: hashedToken,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Refresh token tidak valid atau sudah kadaluarsa');
    }

    // Rotate: deactivate old session, create new one
    await this.prisma.session.update({
      where: { id: session.id },
      data: { isActive: false },
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const rawRefresh = this.generateRawToken();
    const hashedRefresh = this.hashToken(rawRefresh);

    const newSession = await this.prisma.session.create({
      data: {
        userType: session.userType,
        userRefId: session.userRefId,
        refreshToken: hashedRefresh,
        deviceInfo: session.deviceInfo,
        ipAddress: session.ipAddress,
        isActive: true,
        lastActiveAt: now,
        expiresAt,
      },
    });

    const payload: JwtPayload = {
      sub: session.userRefId,
      type: session.userType,
      outletId: undefined,
      sessionId: newSession.id,
    };

    // For staff sessions, retrieve outletId
    if (session.userType === 'staff') {
      const staff = await this.prisma.staff.findUnique({
        where: { id: session.userRefId },
        select: { outletId: true },
      });
      if (staff) payload.outletId = staff.outletId;
    }

    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: rawRefresh,
    };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string, userType: 'owner' | 'staff', sessionId: string, dto: LogoutDto) {
    if (dto.refreshToken) {
      // Revoke specific session by refresh token
      const hashedToken = this.hashToken(dto.refreshToken);
      await this.prisma.session.updateMany({
        where: {
          refreshToken: hashedToken,
          userRefId: userId,
          isActive: true,
        },
        data: { isActive: false },
      });
    } else {
      // Revoke current session only
      await this.prisma.session.updateMany({
        where: { id: sessionId, userRefId: userId },
        data: { isActive: false },
      });
    }

    return { message: 'Logout berhasil' };
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user && user.isActive) {
      const rawToken = this.generateRawToken();
      const hashedToken = this.hashToken(rawToken);
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: expires,
        },
      });

      this.logger.log(
        `[RESET PASSWORD] User ${user.email} — token: ${rawToken}`,
      );
    }

    // Always return 200 to prevent user enumeration
    return { message: 'Jika email terdaftar, link reset password telah dikirim' };
  }

  // ─── Reset Password ───────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = this.hashToken(dto.token);

    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: hashedToken },
    });

    if (!user) {
      throw new BadRequestException('Token tidak valid');
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token sudah kadaluarsa');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Revoke all sessions after password reset
    await this.prisma.session.updateMany({
      where: { userRefId: user.id, userType: 'owner', isActive: true },
      data: { isActive: false },
    });

    return { message: 'Password berhasil direset' };
  }

  // ─── Get Me ───────────────────────────────────────────────────────────────

  async getMe(userId: string, type: 'owner' | 'staff') {
    if (type === 'owner') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!user) throw new UnauthorizedException('User tidak ditemukan');
      return { ...user, type: 'owner' };
    }

    const staff = await this.prisma.staff.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        outletId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!staff) throw new UnauthorizedException('Staff tidak ditemukan');
    return { ...staff, type: 'staff' };
  }
}
