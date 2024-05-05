import { Payment, WithdrawalJob } from '@prisma/client';
import {
  ForwarderFactoryService,
  forwarderFactoryService,
} from '../services/forwarder-factory.service';
import { PaymentsService, paymentsService } from '../services/payments.service';
import { PaymentStatus } from '../types/payment-status';
import {
  WithdrawalsService,
  withdrawalService,
} from '../services/withdrawals.service';
import { WithdrawalJobStatus } from '../types/withdrawal-job-status';
import { Chains } from '../types/chains';

class PaymentsController {
  constructor(
    private readonly forwarderService: ForwarderFactoryService,
    private readonly paymentsService: PaymentsService,
    private readonly withdrawalService: WithdrawalsService,
  ) {}

  async create(params: {
    amount: string;
    token: string;
    chain: Chains;
    forwardTo: string;
  }): Promise<{
    payment: Payment;
    withdrawalJob: WithdrawalJob;
  }> {
    const { salt, address } = await this.forwarderService.computeAddress(
      params.chain,
      params.forwardTo,
    );

    const payment = await this.paymentsService.create({
      amount: params.amount,
      token: params.token,
      chain: params.chain,
      forwardTo: params.forwardTo,
      forwarderAddress: address,
      salt: salt,
      status: PaymentStatus.PENDING,
    });

    // Schedule withdrawal job in one minute
    const withdrawalJob = await this.withdrawalService.push({
      status: WithdrawalJobStatus.PENDING,
      scheduledAt: new Date(Date.now() + 1000 * 60), // in one minute
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // in one hour
      payment: { connect: { id: payment.id } },
    });

    return { payment, withdrawalJob };
  }

  findById(id: string): Promise<Payment | null> {
    return this.paymentsService.findById(id);
  }

  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }
}

export const paymentsController = new PaymentsController(
  forwarderFactoryService,
  paymentsService,
  withdrawalService,
);
