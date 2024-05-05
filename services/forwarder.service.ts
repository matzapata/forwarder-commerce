export class ForwarderService {
  constructor() {}

  canFlush(token: string, amount: string): Promise<boolean> {
    // Can flush

    // throw new Error("Method not implemented.")
    return Promise.resolve(true);
  }

  flush(token: string): Promise<string> {
    // Flush native

    // throw new Error("Method not implemented.")
    return Promise.resolve('hash');
  }
}

export const forwarderService = new ForwarderService();
