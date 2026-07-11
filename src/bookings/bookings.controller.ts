import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Booking Management')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer booking (Public)' })
  @ApiResponse({ status: 201, description: 'Booking successfully created' })
  @ApiResponse({ status: 400, description: 'Validation or Business Rule Violation' })
  @ApiResponse({ status: 499, description: 'Slot already taken' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all bookings with filters & pagination (Protected)' })
  @ApiResponse({ status: 200, description: 'Returns filtered metadata and list' })
  findAll(@Query() filterDto: GetBookingsFilterDto) {
    return this.bookingsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get booking by ID (Protected)' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update status of a booking (Protected)' })
  updateStatus(@Param('id') id: string, @Body() updateBookingStatusDto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, updateBookingStatusDto);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel an existing booking (Protected)' })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
