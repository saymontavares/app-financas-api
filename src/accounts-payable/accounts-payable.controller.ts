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
      100;

    return this.accountsPayableService.create({
      ...createAccountsPayableDto,
      totalInterest: interest,
      installments: this.accountsPayableService.createInstallments(
        createAccountsPayableDto,
      ),
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

  @Patch(':id')
  updateInstallment() {}
}
