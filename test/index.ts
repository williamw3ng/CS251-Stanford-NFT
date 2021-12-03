import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CS251StanfordNFT } from "../typechain";

describe("CS251-Stanford-NFT", function () {
  let CS251StanfordNFT: CS251StanfordNFT;
  let minter: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  this.beforeAll(async () => {
    [minter, account1, account2] = await ethers.getSigners();
  });
  beforeEach(async () => {
    const CS251StanfordNFTFactory = await ethers.getContractFactory(
      "CS251StanfordNFT"
    );
    CS251StanfordNFT = await CS251StanfordNFTFactory.deploy();
    await CS251StanfordNFT.deployed();
  });
  it("Should return the correct name", async function () {
    expect(await CS251StanfordNFT.name()).to.equal("CS251 Stanford NFT");
  });
  it("Should be mintable by minter", async function () {
    const tokenId = 42;
    const tx = await CS251StanfordNFT.safeMint(account1.address, tokenId);
    await tx.wait();
    expect(await CS251StanfordNFT.totalSupply()).to.equal(1);
    expect(await CS251StanfordNFT.balanceOf(minter.address)).to.equal(0);
    expect(await CS251StanfordNFT.balanceOf(account1.address)).to.equal(1);

    const owner = await CS251StanfordNFT.ownerOf(tokenId);
    expect(owner).to.equal(account1.address);

    const retrievedTokenId = await CS251StanfordNFT.tokenOfOwnerByIndex(
      account1.address,
      0
    );
    expect(retrievedTokenId).to.equal(tokenId);
  });
  it("Should not be mintable by non-minter", async function () {
    await expect(
      CS251StanfordNFT.connect(account1).safeMint(account1.address, 42)
    ).to.be.revertedWith("");
  });
  it("Should not be transferable by non-minter", async function () {
    const tokenId = 42;
    const tx = await CS251StanfordNFT.safeMint(account1.address, tokenId);
    await tx.wait();
    const retrievedTokenId = await CS251StanfordNFT.tokenOfOwnerByIndex(
      account1.address,
      0
    );
    expect(retrievedTokenId).to.equal(tokenId);
    await expect(
      CS251StanfordNFT.connect(account1).transferFrom(
        account1.address,
        account2.address,
        tokenId
      )
    ).to.be.revertedWith("");
  });
});
