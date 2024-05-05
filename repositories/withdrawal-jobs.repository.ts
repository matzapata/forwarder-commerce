import { Prisma } from "@prisma/client";
import { PrismaService, prismaService } from "../services/prisma.service";


export class WithdrawalJobsRepository {
    constructor(private readonly prismaService: PrismaService) { }

    create(data: Prisma.WithdrawalJobCreateInput) {
        return this.prismaService.withdrawalJob.create({ data });
    }

    findById(id: string) {
        return this.prismaService.withdrawalJob.findUnique({ where: { id } });
    }

    findAll() {
        return this.prismaService.withdrawalJob.findMany();
    }
}

export const withdrawalJobsRepository = new WithdrawalJobsRepository(prismaService);