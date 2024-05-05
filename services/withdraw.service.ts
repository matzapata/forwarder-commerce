import { WithdrawalJobsRepository } from "../repositories/withdrawal-jobs.repository";


export class WithdrawService {
    constructor(private readonly withdrawalRepo: WithdrawalJobsRepository) { }

    async push(data: any) {
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
}