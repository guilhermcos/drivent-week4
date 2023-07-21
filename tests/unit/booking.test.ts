import { bookingService } from '@/services';
import bookingRepository from '@/repositories/booking-repository';

describe('Booking unit tests', () => {
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
});
