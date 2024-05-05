import { BigNumber, Contract } from 'ethers';
import { Chains } from '../../../types/chains';
import {
  EvmConnectionFactory,
  evmConnectionFactory,
} from '../../../utils/connection';

export class TokenBalanceProvider {
  constructor(private readonly evmConnectionFactory: EvmConnectionFactory) {}

  async getBalance(
    chain: Chains,
    address: string,
    token: string,
  ): Promise<BigNumber> {
    const tokenContract = this.getErc20Contract(chain, token);
    return tokenContract.balanceOf(address) as Promise<BigNumber>;
  }

  getErc20Contract(chain: Chains, token: string): Contract {
    const connection = this.evmConnectionFactory.create(chain);
    return new Contract(
      token,
      ['function balanceOf(address) view returns (uint256)'],
      connection,
    );
  }
}

export const tokenBalanceProvider = new TokenBalanceProvider(
  evmConnectionFactory,
);
