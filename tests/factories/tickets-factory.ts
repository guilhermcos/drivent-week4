import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export function buildTicketType(): TicketType {
  return {
    id: faker.datatype.number(),
    name: faker.random.numeric(3, { allowLeadingZeros: false }),
    price: Number(faker.finance.amount(10, 300, 0)),
    isRemote: false,
    includesHotel: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function buildTicket(enrollmentId: number, status: TicketStatus, ticketType: TicketType) {
  return {
    id: faker.datatype.number(),
    enrollmentId: enrollmentId,
    ticketTypeId: ticketType.id,
    status: status,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    TicketType: ticketType,
  };
}

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}
