import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { extname, join } from 'path';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { OutletOwnerGuard } from './guards/outlet-owner.guard';
import { OutletsService } from './outlets.service';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

const logoStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = join(process.cwd(), 'uploads', 'logos');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const outletId = (req.params as { id: string }).id;
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${outletId}-${Date.now()}${ext}`);
  },
});

const logoFileFilter = (
  _req: unknown,
  file: { mimetype: string; originalname: string },
  cb: (error: Error | null, accepted: boolean) => void,
) => {
  const ext = extname(file.originalname).toLowerCase();
  if (
    !ALLOWED_EXTENSIONS.includes(ext) ||
    !ALLOWED_MIMETYPES.includes(file.mimetype)
  ) {
    return cb(
      new BadRequestException(
        'Format file tidak didukung. Gunakan JPG, PNG, atau WebP',
      ),
      false,
    );
  }
  cb(null, true);
};

@ApiTags('Outlets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('owner')
@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  @ApiOperation({ summary: 'Buat outlet baru' })
  async create(
    @GetUser() user: AuthUser,
    @Body() dto: CreateOutletDto,
  ) {
    return this.outletsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List semua outlet milik owner' })
  async findAll(@GetUser() user: AuthUser) {
    return this.outletsService.findAll(user.userId);
  }

  @Get(':id')
  @UseGuards(OutletOwnerGuard)
  @ApiOperation({ summary: 'Detail outlet' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.outletsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OutletOwnerGuard)
  @ApiOperation({ summary: 'Update profil outlet' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOutletDto,
  ) {
    return this.outletsService.update(id, dto);
  }

  @Post(':id/logo')
  @UseGuards(OutletOwnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload logo outlet (max 2MB, JPG/PNG/WebP)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: logoStorage,
      fileFilter: logoFileFilter,
      limits: { fileSize: MAX_LOGO_SIZE },
    }),
  )
  async uploadLogo(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('File logo wajib diupload');
    }
    const logoUrl = `/uploads/logos/${file.filename}`;
    return this.outletsService.updateLogo(id, logoUrl);
  }
}
