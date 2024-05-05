import { Prisma, WithdrawalJob } from '@prisma/client';
import {
  WithdrawalJobsRepository,
  WithdrawalWithPayment,
  withdrawalJobsRepository,
} from '../repositories/withdrawal-jobs.repository';
import { WithdrawalJobStatus } from '../types/withdrawal-job-status';
import {
  ForwarderFactoryService,
  forwarderFactoryService,
} from './forwarder-factory.service';
import { Chains } from '../types/chains';
import { ForwarderService, forwarderService } from './forwarder.service';
import { PaymentsService, paymentsService } from './payments.service';
import { LoggerService } from './logger.service';
import { BigNumber } from 'ethers';

export class WithdrawalsService {
  constructor(
    private readonly withdrawalRepo: WithdrawalJobsRepository,
    private readonly forwarderFactoryService: ForwarderFactoryService,
    private readonly forwarderService: ForwarderService,
    private readonly paymentService: PaymentsService,
    private readonly logger: LoggerService,
  ) {}

  async push(data: Prisma.WithdrawalJobCreateInput) {
    return this.withdrawalRepo.push(data);
  }

  async consume(): Promise<void> {
    while (true) {
      await this.consumeOne();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async consumeOne(id?: string): Promise<WithdrawalJob | null> {
    // get job and update job status in a transaction, try to get id if that's provided
    const job = await this.withdrawalRepo.startJob(id);
    if (!job) {
      this.logger.info('No job found');
      return null;
    }
    this.logger.info(`Processing job ${job.id}`);

    const ok = await this.withdraw(job);
    this.logger.info(
      `Job ${job.id} processed with status ${ok ? 'success' : 'failed'}`,
    );

    if (ok) return this.withdrawalRepo.completeJob(job.id);
    else return this.withdrawalRepo.releaseJob(job.id);
  }

  async findById(id: string) {
    return this.withdrawalRepo.findById(id);
  }

  async findAll() {
    return this.withdrawalRepo.findAll();
  }

  private async canWithdraw(job: WithdrawalWithPayment): Promise<boolean> {
    if (job.expiresAt < new Date()) {
      // job expired
      return false;
    }

    // check if the payment is already withdrawn
    if (job.payment?.status !== WithdrawalJobStatus.PENDING) {
      // payment already withdrawn
      return false;
    }

    // check balance if is enough
    if (
      !this.forwarderService.canFlush(
        job.payment.chain as Chains,
        job.payment.forwarderAddress,
        job.payment.token,
        BigNumber.from(job.payment.amount),
      )
    ) {
      // balance not enough
      return false;
    }

    return true;
  }

  private async withdraw(job: WithdrawalWithPayment): Promise<boolean> {
    try {
      if (!(await this.canWithdraw(job))) return false;

      await this.forwarderFactoryService.deployForwarder(
        job.payment.chain as Chains,
        job.payment.forwardTo,
        job.payment.salt,
      );

      const hash = await this.forwarderService.flush(
        job.payment.chain as Chains,
        job.payment.forwarderAddress,
        job.payment.token,
      );

      await this.paymentService.update(job.payment.id, {
        status: WithdrawalJobStatus.COMPLETED,
        hash,
      });

      return Promise.resolve(true);
    } catch (error: any) {
      this.logger.error(error?.message);
      return Promise.resolve(false);
    }
  }
}

export const withdrawalService = new WithdrawalsService(
  withdrawalJobsRepository,
  forwarderFactoryService,
  forwarderService,
  paymentsService,
  new LoggerService('WithdrawalsService'),
);
