import {
  Controller,
  //   Get,
  //   Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  //   Param,
  //   Delete,
} from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { UpdateInstallmentsDto } from './dto/updateInsta-ilments.dto';
// import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
// import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
// import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Controller('accounts-payable-installment')
export class AccountsPayableInstallmentController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Patch(':id')
  async updateInstallment(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateInstallment: UpdateInstallmentsDto,
  ) {
    const { installments } = updateInstallment;

    await this.accountsPayableService.updateInstallment(id, installments);

    return { success: true };
  }
}
