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
    const contract = this.getContract(chain);

    const salt = sha3(Date.now());
    const address = await contract.computeAddress(forwardTo, salt);

    // TODO: properly encode salt
    return { salt: salt.toString(), address };
  }

  deployForwarder(
    chain: Chains,
    forwardTo: string,
    salt: string,
  ): Promise<string> {
    const contract = this.getContract(chain);

    // TODO: review this
    return contract.createForwarder(forwardTo, salt);
  }

  private getContract(chain: Chains): Contract {
    const connection = this.evmConnectionFactory.create(chain);
    const contractAddress =
      this.configService.getForwarderFactoryAddress(chain);
    return new Contract(contractAddress, forwarderFactoryAbi, connection);
  }
}

export const forwarderFactoryService = new ForwarderFactoryService(
  evmConnectionFactory,
  configService,
);
