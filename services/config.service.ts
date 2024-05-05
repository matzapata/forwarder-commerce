import "dotenv/config";
import { Chains } from "../types/chains";

export class ConfigService {
    private readonly config: Record<string, string>;
    private readonly forwarderFactoryAddresses: Record<Chains, string>;

    constructor() {
        this.config = {
            FORWARD_TO: "abc",
        }
        this.forwarderFactoryAddresses = {
            [Chains.POLYGON]: process.env.POLYGON_FORWARDER_FACTORY_ADDRESS as string,
        }
    }

    get(key: string): string {
        if (!this.config[key]) {
            throw new Error(`Config Error: ${key} not found`)
        }
        return this.config[key]
    }

    getForwarderFactoryAddress(chain: Chains): string {
        if (!this.forwarderFactoryAddresses[chain]) {
            throw new Error(`ForwarderFactory Address not found for chain ${chain}`)
        }
        return this.forwarderFactoryAddresses[chain]
    }
}

export const configService = new ConfigService();