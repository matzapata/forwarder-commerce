import chalk from 'chalk';

export class LoggerService {
  constructor(private readonly context: string) {}

  log(message: string): void {
    console.log(`[${this.context}] ${message}`);
  }

  info(message: string): void {
    console.log(chalk.dim(`[${this.context}] ${message}`));
  }

  error(message: string): void {
    console.error(chalk.red(`[${this.context}] ${message}`));
  }
}
