import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { BookingStatus } from './enums/booking-status.enum';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockServiceRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create booking', () => {
    const validBookingDto = {
      customerName: 'Test User',
      customerEmail: 'test@entwoh.com',
      customerPhone: '+1234567890',
      serviceId: 'service-123',
      bookingDate: '2099-12-31',
      bookingTime: '10:00',
    };

    it('should throw NotFoundException if service does not exist', async () => {
      mockServiceRepository.findOne.mockResolvedValue(null);

      await expect(service.create(validBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if booking date is in the past', async () => {
      mockServiceRepository.findOne.mockResolvedValue({ id: 'service-123' });
      
      const pastBookingDto = { ...validBookingDto, bookingDate: '2020-01-01' };

      await expect(service.create(pastBookingDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if slot is already booked (Bonus Feature)', async () => {
      mockServiceRepository.findOne.mockResolvedValue({ id: 'service-123' });
      mockBookingRepository.findOne.mockResolvedValue({ id: 'existing-booking' });

      await expect(service.create(validBookingDto)).rejects.toThrow(ConflictException);
    });

    it('should successfully create a booking', async () => {
      mockServiceRepository.findOne.mockResolvedValue({ id: 'service-123' });
      mockBookingRepository.findOne.mockResolvedValue(null);
      mockBookingRepository.create.mockReturnValue(validBookingDto);
      mockBookingRepository.save.mockResolvedValue({ id: 'new-booking', ...validBookingDto });

      const result = await service.create(validBookingDto);

      expect(result).toHaveProperty('id', 'new-booking');
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should throw BadRequestException when changing CANCELLED to COMPLETED', async () => {
      const cancelledBooking = { id: 'booking-123', status: BookingStatus.CANCELLED };
      mockBookingRepository.findOne.mockResolvedValue(cancelledBooking);

      await expect(
        service.updateStatus('booking-123', { status: BookingStatus.COMPLETED })
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully update status', async () => {
      const pendingBooking = { id: 'booking-123', status: BookingStatus.PENDING };
      mockBookingRepository.findOne.mockResolvedValue(pendingBooking);
      mockBookingRepository.save.mockResolvedValue({ ...pendingBooking, status: BookingStatus.CONFIRMED });

      const result = await service.updateStatus('booking-123', { status: BookingStatus.CONFIRMED });

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });
  });
});
