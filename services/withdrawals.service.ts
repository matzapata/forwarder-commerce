import { Prisma } from '@prisma/client';
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
import { BalancesService, balancesService } from './balances/balances.service';

export class WithdrawalsService {
  constructor(
    private readonly withdrawalRepo: WithdrawalJobsRepository,
    private readonly forwarderFactoryService: ForwarderFactoryService,
    private readonly forwarderService: ForwarderService,
    private readonly paymentService: PaymentsService,
    private readonly balancesService: BalancesService,
  ) {}

  async push(data: Prisma.WithdrawalJobCreateInput) {
    return this.withdrawalRepo.push(data);
  }

  async consume() {
    while (true) {
      await this.consumeOne();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async consumeOne(id?: string) {
    // get job and update job status in a transaction, try to get id if that's provided
    const job = await this.withdrawalRepo.startJob(id);
    if (!job) return null;

    const ok = await this.withdraw(job);
    if (ok) return this.withdrawalRepo.completeJob(job.id);
    else return this.withdrawalRepo.failJob(job.id);
  }

  async findById(id: string) {
    return this.withdrawalRepo.findById(id);
  }

  async findAll() {
    return this.withdrawalRepo.findAll();
  }

  private async canWithdraw(job: WithdrawalWithPayment): Promise<boolean> {
    // check if the job is expired
    if (job.expiresAt < new Date()) return false;

    // check if the payment is already withdrawn
    if (job.payment?.status !== WithdrawalJobStatus.PENDING) return false;

    // check balance if is enough
    const balance = await this.balancesService.getBalance(
      job.payment.chain as Chains,
      job.payment.forwarderAddress,
      job.payment.token,
    );
    if (balance.lt(job.payment.amount)) return false;

    return false;
  }

  private async withdraw(job: WithdrawalWithPayment): Promise<boolean> {
    if (!this.canWithdraw(job)) return false;

    const address = await this.forwarderFactoryService.deployForwarder(
      job.payment.chain as Chains,
      job.payment.forwardTo,
      job.payment.salt,
    );

    const hash = await this.forwarderService.flush(job.payment.token);

    await this.paymentService.update(job.payment.id, {
      status: WithdrawalJobStatus.COMPLETED,
      forwarderAddress: address,
      hash,
    });

    return Promise.resolve(true);
  }
}

export const withdrawalService = new WithdrawalsService(
  withdrawalJobsRepository,
  forwarderFactoryService,
  forwarderService,
  paymentsService,
  balancesService,
);
