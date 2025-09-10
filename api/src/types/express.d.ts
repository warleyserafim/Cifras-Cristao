import { Role } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}

export {};