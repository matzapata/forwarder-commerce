import { BigNumber } from 'ethers';
import {
  EvmConnectionFactory,
  evmConnectionFactory,
} from '../../../utils/connection';
import { Chains } from '../../../types/chains';

export class NativeBalanceProvider {
  constructor(private readonly evmConnectionFactory: EvmConnectionFactory) {}

  async getBalance(chain: Chains, address: string): Promise<BigNumber> {
    const connection = this.evmConnectionFactory.create(chain);
    return connection.getBalance(address);
  }
}

export const nativeBalanceProvider = new NativeBalanceProvider(
  evmConnectionFactory,
);
