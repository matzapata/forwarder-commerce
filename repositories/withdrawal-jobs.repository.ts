import { Prisma } from '@prisma/client';
import { PrismaService, prismaService } from '../services/prisma.service';
import { WithdrawalJobStatus } from '../types/withdrawal-job-status';

export type WithdrawalWithPayment = Prisma.WithdrawalJobGetPayload<{
  include: { payment: true };
}>;

export class WithdrawalJobsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  push(data: Prisma.WithdrawalJobCreateInput) {
    return this.prismaService.withdrawalJob.create({ data });
  }

  findById(id: string) {
    return this.prismaService.withdrawalJob.findUnique({ where: { id } });
  }

  findAll() {
    return this.prismaService.withdrawalJob.findMany();
  }

  async startJob(id?: string): Promise<WithdrawalWithPayment | null> {
    let job: WithdrawalWithPayment | null = null;

    await this.prismaService.$transaction(async (tx) => {
      job = await this.prismaService.withdrawalJob.findFirst({
        where: {
          id,
          status: WithdrawalJobStatus.PENDING,
          expiresAt: { gt: new Date(Date.now()) },
          scheduledAt: { lte: new Date(Date.now()) },
        },
        include: { payment: true },
      });
      if (!job) return;

      // Update status to processing
      await this.prismaService.withdrawalJob.update({
        where: { id: job.id },
        data: { status: WithdrawalJobStatus.PROCESSING, startedAt: new Date() },
      });
    });

    return job;
  }

  async completeJob(id: string) {
    return this.prismaService.withdrawalJob.update({
      where: { id },
      data: { status: WithdrawalJobStatus.COMPLETED, completedAt: new Date() },
    });
  }

  async releaseJob(id: string) {
    return this.prismaService.withdrawalJob.update({
      where: { id },
      data: {
        status: WithdrawalJobStatus.PENDING,

        // reschedule the job in one minute
        scheduledAt: new Date(Date.now() + 1000 * 60 * 1),
      },
    });
  }
}

export const withdrawalJobsRepository = new WithdrawalJobsRepository(
  prismaService,
);
