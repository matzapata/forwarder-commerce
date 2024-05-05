
export class ForwarderService {

    
    constructor() { 


    }


    canFlush(token: string, amount: string): Promise<boolean> {    
        // Can flush

        // throw new Error("Method not implemented.")
        return Promise.resolve(true);
    }

    flush(token: string): Promise<void> {
        // Flush native

        // throw new Error("Method not implemented.")
        return Promise.resolve();
    }


}

export const forwarderService = new ForwarderService();