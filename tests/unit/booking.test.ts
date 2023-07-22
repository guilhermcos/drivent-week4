import { bookingService } from '@/services';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { TicketStatus } from '@prisma/client';
import roomRepository from '@/repositories/room-repository';
import { buildEnrollmentWithAdress, buildRoom, buildTicket, buildTicketType } from '../factories';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET Booking unit tests', () => {
  it('should return correct booking info', async () => {
    jest.spyOn(bookingRepository, 'findBookingWithRooms').mockImplementation((): any => {
      return {
        id: 2,
        Room: {
          id: 4,
          name: '123',
          createdAt: '2023-07-20T17:23:38.796Z',
          updatedAt: '2023-07-20T17:23:38.796Z',
          capacity: 3,
          hotelId: 3,
        },
      };
    });

    const bookingInfo = await bookingService.getBooking(1);

    expect(bookingInfo).toEqual(
      expect.objectContaining({
        id: 2,
        Room: {
          id: 4,
          name: '123',
          createdAt: '2023-07-20T17:23:38.796Z',
          updatedAt: '2023-07-20T17:23:38.796Z',
          capacity: 3,
          hotelId: 3,
        },
      }),
    );
  });

  it('Should return status code 404 when no booking found on database', async () => {
    jest.spyOn(bookingRepository, 'findBookingWithRooms').mockImplementation((): any => {
      return null;
    });

    const result = bookingService.getBooking(1);

    expect(result).rejects.toEqual(
      expect.objectContaining({
        name: 'NotFoundError',
      }),
    );
  });
});

describe('POST /booking unit tests', () => {
  it('should return with booking id created when all right', async () => {
    const ticketType = buildTicketType();
    const enrollment = buildEnrollmentWithAdress();
    const bookingId = 4;
    const room = buildRoom();
    const countBookingsByRoom = room.capacity - 2;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollment);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(buildTicket(enrollment.id, TicketStatus.PAID, ticketType));
    jest.spyOn(roomRepository, 'getRoomById').mockResolvedValue(room);
    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockResolvedValue(countBookingsByRoom);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValue(bookingId);

    const userId = enrollment.userId;
    const roomId = room.id;
    const result = await bookingService.createBooking(userId, roomId);

    expect(result).toBe(bookingId);
  });

  it('should throw Not Found room not found', async () => {
    const ticketType = buildTicketType();
    const enrollment = buildEnrollmentWithAdress();
    const bookingId = 4;
    const room: any = null;
    const countBookingsByRoom = room?.capacity - 2;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollment);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(buildTicket(enrollment.id, TicketStatus.PAID, ticketType));
    jest.spyOn(roomRepository, 'getRoomById').mockResolvedValue(room);
    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockResolvedValue(countBookingsByRoom);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValue(bookingId);

    const userId = enrollment.userId;
    const roomId = room?.id;
    const promise = bookingService.createBooking(userId, roomId);

    expect(promise).rejects.toEqual(
      expect.objectContaining({
        name: 'NotFoundError',
      }),
    );
  });

  it('should throw Forbidden when unpaid ticket', async () => {
    const ticketType = buildTicketType();
    const enrollment = buildEnrollmentWithAdress();
    const bookingId = 4;
    const room = buildRoom();
    const countBookingsByRoom = room?.capacity - 2;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollment);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(buildTicket(enrollment.id, TicketStatus.RESERVED, ticketType));
    jest.spyOn(roomRepository, 'getRoomById').mockResolvedValue(room);
    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockResolvedValue(countBookingsByRoom);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValue(bookingId);

    const userId = enrollment.userId;
    const roomId = room?.id;
    const promise = bookingService.createBooking(userId, roomId);

    expect(promise).rejects.toEqual(
      expect.objectContaining({
        name: 'ForbiddenError',
      }),
    );
  });

  it('should throw Forbidden when room out of capacity', async () => {
    const ticketType = buildTicketType();
    const enrollment = buildEnrollmentWithAdress();
    const bookingId = 4;
    const room = buildRoom();
    const countBookingsByRoom = room?.capacity;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollment);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValue(buildTicket(enrollment.id, TicketStatus.PAID, ticketType));
    jest.spyOn(roomRepository, 'getRoomById').mockResolvedValue(room);
    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockResolvedValue(countBookingsByRoom);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValue(bookingId);

    const userId = enrollment.userId;
    const roomId = room?.id;
    const promise = bookingService.createBooking(userId, roomId);

    expect(promise).rejects.toEqual(
      expect.objectContaining({
        name: 'ForbiddenError',
      }),
    );
  });
});
