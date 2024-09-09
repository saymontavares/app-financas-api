import { TypesOfInterest } from '@prisma/client';
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';

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
}
