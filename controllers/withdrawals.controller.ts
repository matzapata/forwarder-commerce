import { Payment, WithdrawalJob } from '@prisma/client';
import {
  WithdrawalsService,
  withdrawalService,
} from '../services/withdrawals.service';

class WithdrawalsController {
  constructor(private readonly withdrawalService: WithdrawalsService) {}

  findById(id: string): Promise<WithdrawalJob | null> {
    return this.withdrawalService.findById(id);
  }

  findAll(): Promise<WithdrawalJob[]> {
    return this.withdrawalService.findAll();
  }

  startWorker() {
    // Start the withdrawal worker
    throw new Error('Method not implemented.');
  }
}

export const withdrawalsController = new WithdrawalsController(
  withdrawalService,
);
