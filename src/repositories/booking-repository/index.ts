import { prisma } from '../../config';

async function findBookingWithRooms(userId: number) {
  const result = await prisma.booking.findFirst({
    where: {
      userId: userId,
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

async function createBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
    select: {
      id: true,
    },
  });
  return booking.id;
}

async function updateBooking(bookingId: number, newRoomId: number) {
  const booking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: newRoomId,
    },
    select: {
      id: true,
    },
  });
  return booking.id;
}

async function countBookingsByRoomId(roomId: number) {
  const count = await prisma.booking.count({
    where: {
      roomId: roomId,
    },
  });
  return count;
}

const bookingRepository = {
  findBookingWithRooms,
  createBooking,
  countBookingsByRoomId,
  updateBooking,
};

export default bookingRepository;
