import { IsEnum, IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../enums/booking-status.enum';

export class GetBookingsFilterDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Search term for customer name or email' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
