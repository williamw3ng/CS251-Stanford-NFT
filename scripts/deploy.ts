import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer)
    throw new Error("No deployer account configured, check hardhat.config.ts");
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const CS251StanfordNFTFactory = await ethers.getContractFactory(
    "CS251StanfordNFT"
  );
  const CS251StanfordNFT = await CS251StanfordNFTFactory.deploy();
  await CS251StanfordNFT.deployed();

  console.log("CS251StanfordNFT deployed to:", CS251StanfordNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
