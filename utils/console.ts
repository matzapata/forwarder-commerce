import { Payment, WithdrawalJob } from '@prisma/client';
import chalk from 'chalk';
import qrcode from 'qrcode';

export const printPayment = (payment: Payment) => {
  console.log(chalk.blue('Payment:'));
  console.log('  id: ', payment.id);
  console.log('  amount: ', payment.amount);
  console.log('  token: ', payment.token);
  console.log('  chain: ', payment.chain);
  console.log('  forwarderAddress: ', payment.forwarderAddress);
  console.log('  status: ', payment.status);
  console.log('  hash: ', payment.hash);
};

export const printPaymentInstructions = (payment: Payment) => {
  qrcode.toString(
    payment.forwarderAddress,
    {
      errorCorrectionLevel: 'H',
      small: true,
      type: 'terminal',
    },
    (err, data) => {
      if (err) throw err;

      console.log(chalk.blue('Payment Instructions:'));
      console.log(
        `  Send: ${payment.amount} ${payment.token} to: ${payment.forwarderAddress}\n`,
      );
      console.log(data);
    },
  );
};

export const printWithdrawalJob = (withdrawalJob: WithdrawalJob) => {
  console.log(chalk.blue('Withdrawal:'));
  console.log(' id: ', withdrawalJob.id);
  console.log(' paymentId: ', withdrawalJob.paymentId);
  console.log(' status: ', withdrawalJob.status);
};

export const printLine = () => {
  console.log(
    chalk.dim(
      '--------------------------------------------------------------------------',
    ),
  );
};
