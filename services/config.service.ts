

// define forward to and load .env
export class ConfigService {
    private readonly config: Record<string, string>;

    constructor() {
        this.config = {
            FORWARD_TO: "abc"
        }
    }

    get(key: string): string {
        if (!this.config[key]) {
            throw new Error(`Config Error: ${key} not found`)
        }
        return this.config[key]
    }
}

export const configService = new ConfigService();