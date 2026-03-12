import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { OutletAccessGuard } from './guards/outlet-access.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AttendanceService, OutletAccessGuard],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
