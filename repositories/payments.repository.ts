import { Payment, Prisma } from "@prisma/client";
import { PrismaService, prismaService } from "../services/prisma.service";


export class PaymentsRepository {

    constructor(private readonly prisma: PrismaService) { }

    create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        return this.prisma.payment.create({ data })
    }

    findById(id: string): Promise<Payment | null> {
        return this.prisma.payment.findUnique({ where: { id } });
    }

    findAll(): Promise<Payment[]> {
        return this.prisma.payment.findMany();
    }
}

export const paymentsRepository = new PaymentsRepository(prismaService);