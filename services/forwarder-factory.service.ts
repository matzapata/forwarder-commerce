import { sha3 } from '@netgum/utils';
import { Contract, ethers } from 'ethers';
import { forwarderFactoryAbi } from '../utils/forwarder-factory-abi';
import {
  EvmConnectionFactory,
  evmConnectionFactory,
} from '../utils/connection';
import { ConfigService, configService } from './config.service';
import { Chains } from '../types/chains';

export class ForwarderFactoryService {
  constructor(
    private readonly evmConnectionFactory: EvmConnectionFactory,
    private readonly configService: ConfigService,
  ) {}

  async computeAddress(
    chain: Chains,
    forwardTo: string,
  ): Promise<{ salt: string; address: string }> {
    const { contract } = this.getContract(chain);

    const salt = sha3(Date.now());
    const address = await contract.computeAddress(forwardTo, salt);

    return { salt: salt.toString('base64'), address };
  }

  async deployForwarder(
    chain: Chains,
    forwardTo: string,
    salt: string,
  ): Promise<string> {
    const { contract, connection } = this.getContract(chain);

    const gasPrice = await connection.getGasPrice();
    const tx = await contract.createForwarder(
      forwardTo,
      Buffer.from(salt, 'base64'),
      { gasLimit: 500000, gasPrice },
    );
    await tx.wait();

    return tx.hash;
  }

  private getContract(chain: Chains): {
    connection: ethers.providers.JsonRpcProvider;
    contract: Contract;
    signer: ethers.Wallet;
  } {
    const connection = this.evmConnectionFactory.create(chain);
    const contractAddress =
      this.configService.getForwarderFactoryAddress(chain);
    const wallet = new ethers.Wallet(
      this.configService.get('OWNER_PRIVATE_KEY'),
    );
    const signer = wallet.connect(connection);

    return {
      connection,
      contract: new Contract(contractAddress, forwarderFactoryAbi, signer),
      signer,
    };
  }
}

export const forwarderFactoryService = new ForwarderFactoryService(
  evmConnectionFactory,
  configService,
);
