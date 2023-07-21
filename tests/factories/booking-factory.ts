import { Booking, Room, User } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(user: User, room: Room) {
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
  return booking;
}

export async function findBookingWithRoomInfo(booking: Booking) {
  const result = await prisma.booking.findUnique({
    where: {
      id: booking.id,
    },
    select: {
      id: true,
      Room: {
        select: {
          id: true,
          name: true,
          capacity: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
}
