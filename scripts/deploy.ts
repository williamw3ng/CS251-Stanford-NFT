import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer)
    throw new Error("No deployer account configured, check hardhat.config.ts");
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const StanfordCS251NFTFactory = await ethers.getContractFactory(
    "StanfordCS251NFT"
  );
  const StanfordCS251NFT = await StanfordCS251NFTFactory.deploy();
  await StanfordCS251NFT.deployed();

  console.log("StanfordCS251NFT deployed to:", StanfordCS251NFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
