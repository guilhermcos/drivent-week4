import { Booking, Room, User } from '@prisma/client';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';

type BookingOptions = {
  bookingId?: number;
  roomId?: number;
  userId?: number;
};

type BookingWithRooms = {
  Room: {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    name: string;
    capacity: number;
    hotelId: number;
  };
  id: number;
};

export function buildBookingWithRooms(options: BookingOptions = {}): BookingWithRooms {
  const {
    bookingId = faker.datatype.number(),
    roomId = faker.datatype.number(),
    userId = faker.datatype.number(),
  } = options;

  return {
    id: bookingId,
    Room: {
      id: roomId,
      name: faker.random.numeric(3, { allowLeadingZeros: false }),
      capacity: 4,
      hotelId: faker.datatype.number(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  };
}

export function buildBooking(options: BookingOptions = {}): Booking {
  const {
    bookingId = faker.datatype.number(),
    roomId = faker.datatype.number(),
    userId = faker.datatype.number(),
  } = options;

  return {
    id: bookingId,
    userId: userId,
    roomId: roomId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

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
