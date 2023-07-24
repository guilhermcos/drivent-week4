import httpStatus from 'http-status';
import { forbiddenError, notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import roomRepository from '../../repositories/room-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { TicketStatus } from '@prisma/client';

async function getBooking(userId: number) {
  const result = await bookingRepository.findBookingWithRooms(userId);
  if (!result) throw notFoundError();

  return result;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === TicketStatus.RESERVED) {
    throw forbiddenError('invalid ticket (remote, not hotel included or unpaid)');
  }

  const room = await roomRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const roomReservedCount = await bookingRepository.countBookingsByRoomId(roomId);
  if (roomReservedCount >= room.capacity)
    throw forbiddenError(`Room out of capacity! reserved: ${roomReservedCount}, capacity: ${room.capacity}`);

  const result = await bookingRepository.createBooking(userId, roomId);

  return result;
}

async function updateBooking(userId: number, roomId: number) {
  const booking = await bookingRepository.findBookingWithRooms(userId);
  if (!booking) throw forbiddenError('User has no booking yet');

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === TicketStatus.RESERVED) {
    throw forbiddenError('invalid ticket (remote, not hotel included or unpaid)');
  }

  const room = await roomRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const roomReservedCount = await bookingRepository.countBookingsByRoomId(roomId);
  if (roomReservedCount >= room.capacity) {
    throw forbiddenError(`Room out of capacity! reserved: ${roomReservedCount}, capacity: ${room.capacity}`);
  }

  const bookingId = await bookingRepository.updateBooking(booking.id, roomId);

  return bookingId;
}

export const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
