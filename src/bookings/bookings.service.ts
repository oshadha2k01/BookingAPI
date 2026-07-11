import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { serviceId, bookingDate, bookingTime } = createBookingDto;

    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException(`Service with ID "${serviceId}" does not exist`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(bookingDate);
    if (targetDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const duplicate = await this.bookingRepository.findOne({
      where: { serviceId, bookingDate, bookingTime },
    });
    if (duplicate) {
      throw new ConflictException('This slot is already booked for this service.');
    }

    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async findAll(filterDto: GetBookingsFilterDto) {
    const { status, search, page = 1, limit = 10 } = filterDto;
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service');

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(booking.customerName) LIKE LOWER(:search) OR LOWER(booking.customerEmail) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['service'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id);
    const newStatus = updateStatusDto.status;

    if (booking.status === BookingStatus.CANCELLED && newStatus === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be directly marked as completed.');
    }

    booking.status = newStatus;
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }
}
