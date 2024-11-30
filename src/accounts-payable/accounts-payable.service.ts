import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountsPayableDto } from './dto/create-accounts-payable.dto';
import { UpdateAccountsPayableDto } from './dto/update-accounts-payable.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createInstallmentDto } from './dto/create-installment.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { StatusAccountPayable, TypesOfInterest } from '@prisma/client';

@Injectable()
export class AccountsPayableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountsPayableDto: CreateAccountsPayableDto) {
    const installmentList = this.createInstallments(createAccountsPayableDto);

    return this.prisma.accounts_payable.create({
      data: {
        ...createAccountsPayableDto,
        installments: {
          create: installmentList,
        },
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
        totalToPay: value.capital.add(value.totalInterest ?? 0),
        percentageInstallmentsPaid: parseInt(
          percentageInstallmentsPaid.toFixed(0),
        ),
      };
    });
  }

  async findOne(id: number) {
    const result = await this.prisma.accounts_payable.findUnique({
      where: { id },
      include: {
        installments: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (result) {
      const totalToPay = (result.capital ?? new Decimal(0)).add(
        result.totalInterest ?? new Decimal(0),
      );

      return {
        ...result,
        totalToPay,
      };
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateAccountsPayableDto: UpdateAccountsPayableDto) {
    return `This action updates a #${id} accountsPayable`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountsPayable`;
  }

  async updateInstallment(id: number, installments: string[]) {
    await this.prisma.installments.updateMany({
      data: {
        itPaid: false,
      },
      where: {
        id: {
          notIn: installments.map((installment) => Number(installment)),
        },
        accountId: id,
      },
    });

    await this.prisma.installments.updateMany({
      data: {
        itPaid: true,
      },
      where: {
        id: {
          in: installments.map((installment) => Number(installment)),
        },
        accountId: id,
      },
    });

    const dbInstallments = await this.prisma.installments.findMany({
      where: {
        accountId: id,
      },
    });
    const allPaid = dbInstallments.every((installment) => installment.itPaid);

    if (allPaid) {
      await this.prisma.accounts_payable.update({
        data: {
          status: StatusAccountPayable.PAID,
        },
        where: {
          id: id,
        },
      });
    }
  }

  createInstallments(createAccountsPayableDto: CreateAccountsPayableDto) {
    const { capital, rate, time, type } = createAccountsPayableDto;
    const installmentList: createInstallmentDto[] = [];
    let totalPaidSoFar = 0;
    let totalInterestSoFar = 0;
    let currentBalance = capital;
    const totalToPay = capital + (capital * rate * time) / 100;

    switch (type) {
      case TypesOfInterest.SIMPLE:
        const interest = (capital * rate * time) / 100;
        const totalAmount = capital + interest;
        const installmentValue = totalAmount / time;

        for (let i = 1; i <= time; i++) {
          totalPaidSoFar += installmentValue;
          totalInterestSoFar = (capital * rate * i) / 100;

          installmentList.push({
            installmentNumber: i,
            installmentValue,
            totalPaid: totalPaidSoFar,
            accruedInterest: totalInterestSoFar,
            itPaid: false,
          });
        }
        break;

      case TypesOfInterest.COMPOSITE:
        const r = rate / 100;
        const n = time;

        // Geração das parcelas com Juros Compostos
        for (let i = 1; i <= n; i++) {
          // Calcula o saldo devedor com juros compostos
          currentBalance = capital * Math.pow(1 + r, i);

          // Calcula os juros acumulados até o período
          totalInterestSoFar = currentBalance - capital;

          // Calcula a parcela do mês com base no saldo devedor
          const installmentValue = currentBalance / time; // A parcela é baseada no saldo total dividido pelo tempo

          totalPaidSoFar += installmentValue; // Atualiza o total pago até o momento

          installmentList.push({
            installmentNumber: i,
            installmentValue,
            totalPaid: totalPaidSoFar,
            accruedInterest: totalInterestSoFar,
            itPaid: false,
          });
        }

        // Ajuste da última parcela para garantir que o total pago seja igual ao totalToPay
        const lastInstallmentDifference = totalToPay - totalPaidSoFar;
        const lastInstallment = installmentList[installmentList.length - 1];
        lastInstallment.installmentValue += lastInstallmentDifference; // Ajusta o valor da última parcela
        lastInstallment.totalPaid = totalToPay;

        break;

      default:
        throw new BadRequestException('Tipo de dívida não encontrada');
    }

    return installmentList;
  }
}
