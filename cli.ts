#!/usr/bin/env ts-node
import { program } from 'commander';
import { paymentsController } from './controllers/payments.controller';
import { z } from 'zod';
import { prismaService } from './services/prisma.service';
import chalk from 'chalk';
import { printLine, printPayment, printWithdrawalJob } from './utils/console';
import { withdrawalsController } from './controllers/withdrawals.controller';
import { Chains } from './types/chains';

program
  .name('forwarder-commerce')
  .description('Create one time addresses for payments')
  .version('0.1.0');

// =========== payments ===========

program
  .command('payments:create')
  .description(
    'Create a one time address for a payment and register a withdrawal job',
  )
  .argument('<string>', 'amount')
  .argument('<string>', 'token')
  .argument('<string>', 'chain')
  .argument('<string>', 'forwardTo')
  .action(async (amount, token, chain, forwardTo) => {
    const createSchema = z.object({
      amount: z.string(),
      token: z.string(),
      chain: z.string(),
      forwardTo: z.string(),
    });
    const params = createSchema.parse({ amount, token, chain, forwardTo });
    if (Object.values(Chains).includes(params.chain as Chains) === false) {
      throw new Error('Invalid chain');
    }

    const { payment, withdrawalJob } = await paymentsController.create({
      amount: params.amount,
      token: params.token,
      chain: params.chain as Chains,
      forwardTo: params.forwardTo,
    });

    printPayment(payment);
    printWithdrawalJob(withdrawalJob);
  });

program
  .command('payments:find')
  .description('Find a payment in db')
  .argument('<string>', 'id')
  .action(async (id) => {
    const findByIdSchema = z.string();
    const params = findByIdSchema.parse(id);

    const payment = await paymentsController.findById(params);

    if (!payment) console.log(chalk.red('Payment not found'));
    else {
      printLine();
      printPayment(payment);
      printLine();
    }
  });

program
  .command('payments:find-all')
  .description('Find all payments in db')
  .action(async () => {
    const payments = await paymentsController.findAll();

    if (payments.length === 0) {
      return console.log(chalk.red('No payments found'));
    }

    printLine();
    for (const payment of payments) {
      printPayment(payment);
      printLine();
    }
  });

// =========== withdraw ===========

program
  .command('withdrawals-jobs:consume')
  .description('Consume a withdrawal job by id')
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

program
  .command('withdrawals-jobs:consume-worker')
  .description('Start consuming withdrawal jobs in a loop')
  .action(async () => {
    console.log(chalk.green('Starting withdrawal worker'));
    withdrawalsController.startWorker();
  });

program
  .command('withdrawals-jobs:find')
  .description('Find withdrawal job by id')
  .argument('<string>', 'id')
  .action(async (id) => {
    const withdrawSchema = z.string();
    const withdrawalId = withdrawSchema.parse(id);

    const withdrawalJob = await withdrawalsController.findById(withdrawalId);
    if (!withdrawalJob) console.log(chalk.red('Withdrawal job not found'));
    else {
      printLine();
      printWithdrawalJob(withdrawalJob);
      printLine();
    }
  });

program
  .command('withdrawals-jobs:find-all')
  .description('Find all withdrawal jobs')
  .action(async () => {
    const withdrawalJob = await withdrawalsController.findAll();

    if (withdrawalJob.length === 0) {
      return console.log(chalk.red('No withdrawal jobs found'));
    }

    printLine();
    for (const job of withdrawalJob) {
      printWithdrawalJob(job);
      printLine();
    }
  });

prismaService
  .$connect()
  .then(() => {
    program.parse();
  })
  .catch((e) => {
    console.log(chalk.red('Error connecting to db'));
    console.log(e);
  });
