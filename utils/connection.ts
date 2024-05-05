import { ethers } from 'ethers';
import { Chains } from '../types/chains';
import 'dotenv/config';

export class EvmConnectionFactory {
  constructor(private readonly chainsRpc: Record<Chains, string>) {}

  create(chain: Chains): ethers.providers.JsonRpcProvider {
    const rpc = this.chainsRpc[chain];
    if (!rpc) throw new Error(`RPC not found for chain ${chain}`);

    return new ethers.providers.JsonRpcProvider(rpc);
  }
}

export const evmConnectionFactory = new EvmConnectionFactory({
  [Chains.POLYGON]: process.env.POLYGON_RPC as string,
});
