import { BigNumber, ethers } from 'ethers';
import {
  TokenBalanceProvider,
  tokenBalanceProvider,
} from './providers/token-balance.provider';
import {
  NativeBalanceProvider,
  nativeBalanceProvider,
} from './providers/native-balance.provider';
import { Chains } from '../../types/chains';

export class BalancesService {
  constructor(
    private readonly tokenBalanceProvider: TokenBalanceProvider,
    private readonly nativeBalanceProvider: NativeBalanceProvider,
  ) {}

  getBalance(
    chain: Chains,
    address: string,
    token: string,
  ): Promise<BigNumber> {
    if (token === ethers.constants.AddressZero) {
      return this.nativeBalanceProvider.getBalance(chain, address);
    } else {
      return this.tokenBalanceProvider.getBalance(chain, address, token);
    }
  }
}

export const balancesService = new BalancesService(
  tokenBalanceProvider,
  nativeBalanceProvider,
);
