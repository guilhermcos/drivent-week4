import Joi from 'joi';
import { BookingPostRequest } from '../protocols';

export const bookingPostSchema = Joi.object<BookingPostRequest>({
  roomId: Joi.number().integer().required(),
});
