import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import { bookingService } from '../services';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const result = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).send(result);
}
