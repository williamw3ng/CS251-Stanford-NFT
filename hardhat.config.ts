import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const MUMBAI_RPC_URL = "https://matic-mumbai.chainstacklabs.com";
const POLYGON_RPC_UTL = "https://polygon-rpc.com/";
const POLYGON_ACCOUNTS =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

// Address: 0x08b353377aCea9a9f2c68F082fc6C80E09Ad7Aab
const MUMBAI_ACCOUNTS = [
  "0xef44f641fb45153d599239a29161c158149f989959711cf89af260826883500c",
];

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: MUMBAI_ACCOUNTS,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: MUMBAI_ACCOUNTS,
    },
    polygon: {
      url: POLYGON_RPC_UTL,
      accounts: POLYGON_ACCOUNTS,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
