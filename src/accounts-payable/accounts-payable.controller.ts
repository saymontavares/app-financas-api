import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { createInstallmentDto } from './dto/create-installment.dto';

@Controller('accounts-payable')
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Post()
  create(@Body() createAccountsPayableDto: CreateAccountsPayableDto) {
    const interest =
      (createAccountsPayableDto.capital *
        createAccountsPayableDto.rate *
        createAccountsPayableDto.time) /
      100; // Juros simples
    const totalAmount = createAccountsPayableDto.capital + interest; // Valor total após os juros
    const installmentValue = totalAmount / createAccountsPayableDto.time; // Valor de cada parcela
    // Criar lista de parcelas
    const installmentList: createInstallmentDto[] = [];
    let totalPaidSoFar = 0;
    let totalInterestSoFar = 0;
    for (let i = 1; i <= createAccountsPayableDto.time; i++) {
      totalPaidSoFar += installmentValue;
      totalInterestSoFar =
        (createAccountsPayableDto.capital * createAccountsPayableDto.rate * i) /
        100;
      installmentList.push({
        installmentNumber: i,
        installmentValue: installmentValue,
        totalPaid: totalPaidSoFar,
        accruedInterest: totalInterestSoFar,
        itPaid: false,
      });
    }

    return this.accountsPayableService.create({
      ...createAccountsPayableDto,
      installments: installmentList,
    });
  }

  @Get()
  findAll() {
    return this.accountsPayableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsPayableService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountsPayableDto: UpdateAccountsPayableDto,
  ) {
    return this.accountsPayableService.update(+id, updateAccountsPayableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsPayableService.remove(+id);
  }
}
