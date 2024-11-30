import { IsArray, IsString } from 'class-validator';

export class UpdateInstallmentsDto {
  @IsArray({ message: 'Não é uma array' })
  @IsString({ each: true })
  installments: string[];
}
