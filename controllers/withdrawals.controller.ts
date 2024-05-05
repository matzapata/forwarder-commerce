import { WithdrawalJob } from '@prisma/client';
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

  consume(): Promise<void> {
    return this.withdrawalService.consume();
  }

  consumeOne(id: string): Promise<WithdrawalJob | null> {
    return this.withdrawalService.consumeOne(id);
  }
}

export const withdrawalsController = new WithdrawalsController(
  withdrawalService,
);
