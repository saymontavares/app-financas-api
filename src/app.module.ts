import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsPayableModule } from './accounts-payable/accounts-payable.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AccountsPayableModule],
})
export class AppModule {}
