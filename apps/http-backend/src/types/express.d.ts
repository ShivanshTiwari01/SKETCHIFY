import { prisma } from '@repo/db/prisma';
const user = prisma.user;

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
