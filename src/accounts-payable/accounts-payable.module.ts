import { Module } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountsPayableInstallmentController } from './accounts-payable-installment.controller';

@Module({
  controllers: [
    AccountsPayableController,
    AccountsPayableInstallmentController,
  ],
  providers: [AccountsPayableService],
  imports: [PrismaModule],
})
export class AccountsPayableModule {}
