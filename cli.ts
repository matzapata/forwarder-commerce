import { program } from 'commander';
import { paymentsController } from './controllers/payments.controller';
import { z } from 'zod';
import { prismaService } from './services/prisma.service';
import chalk from 'chalk';
import { printPayment, printWithdrawalJob } from './utils/console';
import { withdrawalsController } from './controllers/withdrawals.controller';

program
    .name('forwarder-commerce')
    .description('Create one time addresses for payments')
    .version('0.1.0');

program.command('create')
    .description('Create a one time address for a payment and register a withdrawal job')
    .argument('<string>', 'amount')
    .argument('<string>', 'token')
    .argument('<string>', 'chain')
    .argument('<string>', 'forwardTo')
    .action(async (amount, token, chain, forwardTo) => {
        // validate input
        const createSchema = z.object({
            amount: z.string(),
            token: z.string(),
            chain: z.string(),
            forwardTo: z.string(),
        });
        const params = createSchema.parse({ amount, token, chain, forwardTo });
        if (Object.values(Chains).includes(params.chain as Chains) === false) {
            throw new Error("Invalid chain")
        }

        // call controller
        const { payment, withdrawalJob } = await paymentsController.create({
            amount: params.amount,
            token: params.token,
            chain: params.chain as Chains,
            forwardTo: params.forwardTo
        })

        // print result
        console.log(chalk.blue("Payment:"))
        printPayment(payment)
        console.log(chalk.blue("Withdrawal Job:"))
        printWithdrawalJob(withdrawalJob)
    });

program.command('find')
    .description('Find a payment in db')
    .argument('<string>', 'id')
    .action(async (id) => {
        // validate input
        const findByIdSchema = z.string();
        const params = findByIdSchema.parse(id);

        // call controller
        const payment = await paymentsController.findById(params)

        // print result
        if (!payment) console.log(chalk.red('Payment not found'))
        else printPayment(payment)
    });

program.command('find-all')
    .description('Find all payments in db')
    .action(async () => {
        const payments = await paymentsController.findAll()
        for (const payment of payments) {
            console.log("- " + payment.id, payment.amount, payment.token, payment.chain, payment.forwarderAddress, payment.status)
        }
    });

program.command('withdraw')
    .description('Manually check if a payment can be withdrawn and do it if possible')
    .argument('<string>', 'id')
    .action(async (id) => {
        // validate input
        const withdrawSchema = z.string();
        const paymentId = withdrawSchema.parse(id);

        // call controller
        // const { payment, withdrawalJob } = await withdrawalsController.consume(paymentId)

        // print result
        // console.log(chalk.blue("Payment:"))
        // printPayment(payment)
        // console.log(chalk.blue("Withdrawal Job:"))
        // console.log("id: ", withdrawalJob.id)
    });

program.command('withdraw-worker')
    .description('Start a withdrawal worker')
    .action(async () => {
        console.log(chalk.green("Starting withdrawal worker"))
        withdrawalsController.startWorker()
    });

program.command('withdraw-jobs-find')
    .description('Find withdrawal job by id')
    .argument('<string>', 'id')
    .action(async (id) => {
        // validate input
        const withdrawSchema = z.string();
        const withdrawalId = withdrawSchema.parse(id);

        const withdrawalJob = await withdrawalsController.findById(withdrawalId)
        if (!withdrawalJob) console.log(chalk.red('Withdrawal job not found'))
        else printWithdrawalJob(withdrawalJob)

    });

program.command('withdraw-jobs-find-all')
    .description('Find all withdrawal jobs')
    .action(async () => {
        const withdrawalJob = await withdrawalsController.findAll()
        for (const job of withdrawalJob) {
            console.log("- " + job.id, job.paymentId, job.status)
        }
    });

prismaService.$connect().then(() => {
    program.parse();
});