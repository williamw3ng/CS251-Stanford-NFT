import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CS251StanfordNFT } from "../typechain";

describe("CS251-Stanford-NFT", function () {
  let CS251StanfordNFT: CS251StanfordNFT;
  let minter: SignerWithAddress;
  let account1: SignerWithAddress;
  this.beforeAll(async () => {
    [minter, account1] = await ethers.getSigners();
  });
  this.beforeAll(async () => {
    const CS251StanfordNFTFactory = await ethers.getContractFactory(
      "CS251StanfordNFT"
    );
    CS251StanfordNFT = await CS251StanfordNFTFactory.deploy();
    await CS251StanfordNFT.deployed();
  });
  it("Should return the correct name", async function () {
    const CS251StanfordNFTFactory = await ethers.getContractFactory(
      "CS251StanfordNFT"
    );
    const CS251StanfordNFT = await CS251StanfordNFTFactory.deploy();
    await CS251StanfordNFT.deployed();

    expect(await CS251StanfordNFT.name()).to.equal("CS251-Stanford-NFT");
  });
});
