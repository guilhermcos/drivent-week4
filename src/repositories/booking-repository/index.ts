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

const bookingRepository = {
  findBookingWithRooms,
};

export default bookingRepository;
