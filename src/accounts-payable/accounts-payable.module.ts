import { Module } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AccountsPayableController],
  providers: [AccountsPayableService],
  imports: [PrismaModule],
})
export class AccountsPayableModule {}
