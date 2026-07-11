import { IsEmail, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Oshadha Pathiraja' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'oshadha@entwoh.com' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+94771234567' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2026-08-15', description: 'Format: YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: '14:30', description: 'Format: HH:MM' })
  @IsString()
  @IsNotEmpty()
  bookingTime: string;

  @ApiProperty({ example: 'Prefer afternoon slot', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
