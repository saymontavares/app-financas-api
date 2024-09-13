import { installments, TypesOfInterest } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { createInstallmentDto } from './create-installment.dto';

export class CreateAccountsPayableDto {
  @IsNotEmpty({ message: 'O campo "name" não pode ser vazio' })
  @MinLength(3, { message: 'O campo "name" min de 3' })
  name: string;

  @IsNotEmpty({ message: 'O campo "capital" não pode ser vazio' })
  capital: number;

  @IsNotEmpty({ message: 'O campo "rate" não pode ser vazio' })
  rate: number;

  @IsNotEmpty({ message: 'O campo "time" não pode ser vazio' })
  time: number;

  @IsNotEmpty({ message: 'O campo "type" não pode ser vazio' })
  @IsEnum(TypesOfInterest)
  type: TypesOfInterest;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => createInstallmentDto)
  installments?: createInstallmentDto[];
}
