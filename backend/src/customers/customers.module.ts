import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomersController],
  providers: [CustomersService, OutletAccessGuard],
  exports: [CustomersService],
})
export class CustomersModule {}
