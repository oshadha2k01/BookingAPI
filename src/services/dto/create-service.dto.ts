import { IsNotEmpty, IsString, IsNumber, IsBoolean, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Full Stack Consultation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A comprehensive technical session to architect backend microservices.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 minute' })
  duration: number;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
