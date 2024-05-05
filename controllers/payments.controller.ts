import { Payment, WithdrawalJob } from "@prisma/client";
import { ForwarderService, forwarderService } from "../services/forwarder-factory.service";
import { PaymentsService, paymentsService } from "../services/payments.service";
import { PaymentStatus } from "../types/payment-status";
import { ConfigService, configService } from "../services/config.service";


class PaymentsController {

    constructor(
        private readonly forwarderService: ForwarderService,
        private readonly paymentsService: PaymentsService,
        private readonly configService: ConfigService
    ) { }

    async create(params: { amount: string, token: string, chain: string }): Promise<{
        payment: Payment,
        withdrawalJob: WithdrawalJob | null
    }> {
        // compute address
        const { salt, address } = await this.forwarderService.computeAddress(this.configService.get("FORWARD_TO"));

        // save payment to db
        const payment = await this.paymentsService.create({
            amount: params.amount,
            token: params.token,
            chain: params.chain,
            forwarderAddress: address,
            salt: salt,
            expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            status: PaymentStatus.PENDING,
        });

        // cerate withdrawal job


        return { payment, withdrawalJob: null }
        // throw new Error("Method not implemented.")
    }

    findById(id: string): Promise<Payment | null> {
        return this.paymentsService.findById(id)
    }

    findAll(): Promise<Payment[]> {
        return this.paymentsService.findAll()
    }

    startWithdrawalWorker(): Promise<string> {
        // Start the withdrawal worker
        throw new Error("Method not implemented.")
    }

    withdraw(id: string): Promise<{
        payment: Payment,
        withdrawalJob: WithdrawalJob
    }> {
        // Withdraw payment to user wallet
        throw new Error("Method not implemented.")
    }
}

export const paymentsController = new PaymentsController(
    forwarderService,
    paymentsService,
    configService
);
