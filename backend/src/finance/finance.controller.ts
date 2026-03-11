import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { OutletAccessGuard } from './guards/outlet-access.guard';
import { FinanceService } from './finance.service';
import { QueryIncomeDto } from './dto/query-income.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryProfitDto } from './dto/query-profit.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, OutletAccessGuard)
@Controller('outlets/:id/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('income')
  @Roles('owner')
  @ApiOperation({ summary: 'Pemasukan (daftar order lunas + summary + chart)' })
  getIncome(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryIncomeDto,
  ) {
    return this.financeService.getIncome(outletId, query);
  }

  @Get('expenses')
  @Roles('owner')
  @ApiOperation({ summary: 'Pengeluaran (daftar + summary + trend)' })
  getExpenses(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryExpensesDto,
  ) {
    return this.financeService.getExpenses(outletId, query);
  }

  @Post('expenses')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Catat pengeluaran baru' })
  createExpense(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Body() dto: CreateExpenseDto,
    @GetUser() user: AuthUser,
  ) {
    return this.financeService.createExpense(outletId, dto, user);
  }

  @Patch('expenses/:expenseId')
  @Roles('owner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pengeluaran' })
  updateExpense(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.financeService.updateExpense(outletId, expenseId, dto);
  }

  @Delete('expenses/:expenseId')
  @Roles('owner')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus pengeluaran' })
  deleteExpense(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
  ) {
    return this.financeService.deleteExpense(outletId, expenseId);
  }

  @Get('expense-categories')
  @Roles('owner', 'staff')
  @ApiOperation({ summary: 'Daftar kategori pengeluaran (dengan subkategori)' })
  getExpenseCategories(@Param('id', ParseUUIDPipe) outletId: string) {
    return this.financeService.getExpenseCategories(outletId);
  }

  @Get('profit')
  @Roles('owner')
  @ApiOperation({ summary: 'Profit per layanan (Pro only)' })
  getProfit(
    @Param('id', ParseUUIDPipe) outletId: string,
    @Query() query: QueryProfitDto,
  ) {
    return this.financeService.getProfit(outletId, query);
  }
}
