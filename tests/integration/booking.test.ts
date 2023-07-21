import supertest from 'supertest';
import app, { init } from '@/app';
import * as jwt from 'jsonwebtoken';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
  findBookingWithRoomInfo,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { object } from 'joi';

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 200 and Booking data when valid user has a reservation', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user, room);

      const bookingInfo = await findBookingWithRoomInfo(booking);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: bookingInfo.id,
          Room: {
            id: bookingInfo.Room.id,
            name: bookingInfo.Room.name,
            capacity: bookingInfo.Room.capacity,
            hotelId: bookingInfo.Room.hotelId,
            createdAt: bookingInfo.Room.createdAt.toISOString(),
            updatedAt: bookingInfo.Room.updatedAt.toISOString(),
          },
        }),
      );
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status code 201 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const body = {
        roomId: room.id,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          bookingId: expect.any(Number),
        }),
      );
    });
  });
});
