import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ServicesService, OutletAccessGuard],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
