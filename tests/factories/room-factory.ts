import { faker } from '@faker-js/faker';
import { Room } from '@prisma/client';

export function buildRoom(): Room {
  return {
    id: faker.datatype.number(),
    name: faker.name.firstName(),
    capacity: 4,
    hotelId: faker.datatype.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}
