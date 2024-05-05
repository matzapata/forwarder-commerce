import { Prisma } from "@prisma/client";
import { PrismaService, prismaService } from "../services/prisma.service";


export class WithdrawalJobsRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: Prisma.WithdrawalJobCreateInput) {
        return this.prismaService.withdrawalJob.create({ data });
    }
}

export const withdrawalJobsRepository = new WithdrawalJobsRepository(prismaService);