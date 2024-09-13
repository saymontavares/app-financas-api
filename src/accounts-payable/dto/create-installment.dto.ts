import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class createInstallmentDto {
  @IsNotEmpty({ message: 'O campo "installmentNumber" não pode ser vazio' })
  @IsNumber({}, { message: 'O campo "installmentNumber" deve ser um número' })
  installmentNumber: number;

  @IsNotEmpty({ message: 'O campo "totalPaid" não pode ser vazio' })
  @IsNumber({}, { message: 'O campo "totalPaid" deve ser um número' })
  totalPaid: number;

  @IsNotEmpty({ message: 'O campo "accruedInterest" não pode ser vazio' })
  @IsNumber({}, { message: 'O campo "accruedInterest" deve ser um número' })
  accruedInterest: number;

  @IsNotEmpty({ message: 'O campo "accruedInterest" não pode ser vazio' })
  @IsNumber({}, { message: 'O campo "accruedInterest" deve ser um número' })
  installmentValue: number;

  @IsNotEmpty({ message: 'O campo "itPaid" não pode ser vazio' })
  @IsBoolean({ message: 'O campo "itPaid" deve ser um valor booleano' })
  itPaid: boolean;
}
