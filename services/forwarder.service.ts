import { BigNumber, Contract, ethers } from 'ethers';
import { Chains } from '../types/chains';
import { BalancesService, balancesService } from './balances/balances.service';
import {
  EvmConnectionFactory,
  evmConnectionFactory,
} from '../utils/connection';
import { ConfigService, configService } from './config.service';
import { forwarderAbi } from '../utils/forwarder-abi';

export class ForwarderService {
  constructor(
    private readonly balancesService: BalancesService,
    private readonly evmConnectionFactory: EvmConnectionFactory,
    private readonly configService: ConfigService,
  ) {}

  async canFlush(
    chain: Chains,
    forwarderAddress: string,
    token: string,
    amount: BigNumber,
  ): Promise<boolean> {
    const balance = await this.balancesService.getBalance(
      chain,
      forwarderAddress,
      token,
    );
    return balance.gte(amount);
  }

  async flush(chain: Chains, at: string, token: string): Promise<string> {
    const { contract, connection } = this.getContract(chain, at);

    const gasPrice = await connection.getGasPrice();
    const tx = await contract.flush(token, { gasPrice, gasLimit: 50000 });
    await tx.wait();

    return tx.hash;
  }

  private getContract(
    chain: Chains,
    at: string,
  ): {
    contract: Contract;
    connection: ethers.providers.JsonRpcProvider;
    signer: ethers.Wallet;
  } {
    const connection = this.evmConnectionFactory.create(chain);
    const wallet = new ethers.Wallet(
      this.configService.get('OWNER_PRIVATE_KEY'),
    );
    const signer = wallet.connect(connection);

    return {
      contract: new Contract(at, forwarderAbi, signer),
      connection,
      signer,
    };
  }
}

export const forwarderService = new ForwarderService(
  balancesService,
  evmConnectionFactory,
  configService,
);
