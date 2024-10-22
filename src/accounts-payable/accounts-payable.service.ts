import { Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createInstallmentDto } from './dto/create-installment.dto';

@Injectable()
export class AccountsPayableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    return this.prisma.accounts_payable.create({
      data: {
        ...createAccountsPayableDto,
        installments: createAccountsPayableDto.installments
          ? {
              create: createAccountsPayableDto.installments,
            }
          : undefined,
      },
    });
  }

  async findAll() {
    const all = await this.prisma.accounts_payable.findMany({
      include: { installments: true },
    });

    return all.map((value) => {
      const totalInstallments = value.installments.length;
      const totalInstallmentsPaid = value.installments.filter(
        (installment) => installment.itPaid,
      ).length;

      const percentageInstallmentsPaid =
        totalInstallments > 0
          ? (totalInstallmentsPaid / totalInstallments) * 100
          : 0;

      return {
        ...value,
        percentageInstallmentsPaid: parseInt(
          percentageInstallmentsPaid.toFixed(0),
        ),
      };
    });
  }

  findOne(id: number) {
    return this.prisma.accounts_payable.findUnique({
      where: { id: id },
      include: {
        installments: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    return `This action updates a #${id} accountsPayable`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountsPayable`;
  }

  createInstallments(createAccountsPayableDto: CreateAccountsPayableDto) {
    const interest =
      (createAccountsPayableDto.capital *
        createAccountsPayableDto.rate *
        createAccountsPayableDto.time) /
      100; // Juros simples
    const totalAmount = createAccountsPayableDto.capital + interest; // Valor total após os juros
    const installmentValue = totalAmount / createAccountsPayableDto.time; // Valor de cada parcela
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

    return installmentList;
  }
}
