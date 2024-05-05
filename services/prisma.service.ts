
import { PrismaClient } from '@prisma/client';

export const prismaService = new PrismaClient();
export { PrismaClient as PrismaService };