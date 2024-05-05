import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const POLYGON_RPC = process.env.POLYGON_RPC as string;
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      url: POLYGON_RPC,
      accounts: [POLYGON_PRIVATE_KEY],
    },
  },
};

export default config;
