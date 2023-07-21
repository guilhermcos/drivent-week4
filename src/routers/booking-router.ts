import { Router } from 'express';
import { authenticateToken, validateBody } from '../middlewares';
import { createBooking, getBooking } from '../controllers';
import { bookingPostSchema } from '../schemas/bookings-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingPostSchema), createBooking);

export { bookingRouter };
