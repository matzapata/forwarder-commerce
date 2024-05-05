import { Prisma } from "@prisma/client";
import { WithdrawalJobsRepository, withdrawalJobsRepository } from "../repositories/withdrawal-jobs.repository";


export class WithdrawalService {
    constructor(private readonly withdrawalRepo: WithdrawalJobsRepository) { }

    async push(data: Prisma.WithdrawalJobCreateInput) {
        return this.withdrawalRepo.create(data);
    }

    async consume(props: { id?: string, limit?: number }) {
        // polls from db
        // if id, just process id
        // if limit, process limit number of jobs
        // else process in a loop

        if (props.id) {
            // process id
        } else {
            // process limit or all
            const limit = props.limit || Infinity;
            
        }
    }

    canWithdraw(id: string) {

    }

    async findById(id: string) {
        return this.withdrawalRepo.findById(id);
    }

    async findAll() {
        return this.withdrawalRepo.findAll();
    }
}

export const withdrawalService = new WithdrawalService(withdrawalJobsRepository);