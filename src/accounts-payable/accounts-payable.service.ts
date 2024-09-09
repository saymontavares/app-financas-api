import { Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsPayableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    return this.prisma.accounts_payable.create({
      data: createAccountsPayableDto,
    });
  }

  async findAll() {
    return this.prisma.accounts_payable.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} accountsPayable`;
  }

  update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    return `This action updates a #${id} accountsPayable`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountsPayable`;
  }
}
