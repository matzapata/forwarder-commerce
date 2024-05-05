import { Payment, WithdrawalJob } from "@prisma/client";
import chalk from "chalk";

export const printPayment = (payment: Payment) => {
    console.log(chalk.blue("Payment:"))
    console.log("  id: ", payment.id)
    console.log("  amount: ", payment.amount)
    console.log("  token: ", payment.token)
    console.log("  chain: ", payment.chain)
    console.log("  forwarderAddress: ", payment.forwarderAddress)
    console.log("  status: ", payment.status)
}

export const printWithdrawalJob = (withdrawalJob: WithdrawalJob) => {
    console.log(chalk.blue("Withdrawal:"))
    console.log(" id: ", withdrawalJob.id)
    console.log(" paymentId: ", withdrawalJob.paymentId)
    console.log(" status: ", withdrawalJob.status)
    // console.log("txHash: ", withdrawalJob.txHash)
}

export const printLine = () => {
    console.log(chalk.dim("--------------------------------------------------------------------------"))
}