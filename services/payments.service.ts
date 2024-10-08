import { Payment, Prisma } from '@prisma/client';
import {
  PaymentsRepository,
  paymentsRepository,
} from '../repositories/payments.repository';

export class PaymentsService {
  constructor(private readonly paymentRepository: PaymentsRepository) {}

  create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.paymentRepository.create(data);
  }

  findById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return this.paymentRepository.update(id, data);
  }
}

export const paymentsService = new PaymentsService(paymentsRepository);
