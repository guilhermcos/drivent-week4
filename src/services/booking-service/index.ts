import { notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';

async function getBooking(userId: number) {
  const result = await bookingRepository.findBookingWithRooms(userId);
  if (!result) throw notFoundError();
  
  return result;
}

export const bookingService = {
  getBooking,
};
