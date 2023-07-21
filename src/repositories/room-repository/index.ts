import { prisma } from '../../config';

async function getRoomById(roomId: number) {
  const result = prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  return result;
}

const roomRepository = { getRoomById };
export default roomRepository;
