import { sha3 } from '@netgum/utils';

export class ForwarderService {
    constructor() { }

    computeAddress(forwardTo: string): Promise<{ salt: string, address: string }> {
        // Compute address
        const salt = sha3(Date.now());

        // throw new Error("Method not implemented.")
        return Promise.resolve({ salt: salt.toString(), address: forwardTo });
    }

    deployForwarder(): Promise<string> {
        // Deploy forwarder

        // throw new Error("Method not implemented.")
        return Promise.resolve("0x1234");
    }
}

export const forwarderService = new ForwarderService();