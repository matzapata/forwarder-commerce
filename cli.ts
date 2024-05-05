import { program } from 'commander';
import { paymentsController } from './controllers/payments.controller';
import { z } from 'zod';
import { prismaService } from './services/prisma.service';
import chalk from 'chalk';
import { printPayment } from './utils/console';

program
    .name('forwarder-commerce')
    .description('Create one time addresses for payments')
    .version('0.1.0');

program.command('create')
    .description('Create a one time address for a payment and register a withdrawal job')
    .argument('<string>', 'amount')
    .argument('<string>', 'token')
    .argument('<string>', 'chain')
    .action(async (amount, token, chain) => {
        // validate input
        const createSchema = z.object({
            amount: z.string(),
            token: z.string(),
            chain: z.string()
        });
        const params = createSchema.parse({ amount, token, chain });

        // call controller
        const { payment, withdrawalJob } = await paymentsController.create(params)

        // print result
        console.log(chalk.blue("Payment:"))
        printPayment(payment)
        // console.log(chalk.blue("Withdrawal Job:"))
        // console.log("id: ", withdrawalJob.id)
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

program.command('start-withdrawal-worker')
    .description('Start a withdrawal worker')
    .action(async () => {
        const workerId = await paymentsController.startWithdrawalWorker()
        console.log(chalk.green("Worker started with id: ", workerId))
    });

program.command('withdraw')
    .description('Withdraw payment to user wallet')
    .argument('<string>', 'id')
    .action(async (id) => {
        // validate input
        const withdrawSchema = z.string();
        const paymentId = withdrawSchema.parse(id);

        // call controller
        const {payment, withdrawalJob} = await paymentsController.withdraw(paymentId)
        console.log(chalk.blue("Payment:"))
        printPayment(payment)
        console.log(chalk.blue("Withdrawal Job:"))
        console.log("id: ", withdrawalJob.id)
    });

prismaService.$connect().then(() => {
    program.parse();
});