import { ethers } from "hardhat";

/**
 * Will deploy contract to `--network` with the configured account
 * for such network in hardhat.config.ts. Ensure such account has sufficient
 * balance to complete the transaction.
 *
 * To run:
 *   yarn hardhat run scripts/deploy.ts --network [mumbai | polygon]
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("No deployer account configured, check hardhat.config.ts");
  if (!deployer.provider) throw new Error("No provider configured");

  console.log(`Connected to chainId: ${(await deployer.provider.getNetwork()).chainId}`);
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const StanfordCS251NFTFactory = await ethers.getContractFactory("StanfordCS251NFT");
  const StanfordCS251NFT = await StanfordCS251NFTFactory.deploy();
  await StanfordCS251NFT.deployed();

  console.log("StanfordCS251NFT deployed to:", StanfordCS251NFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
