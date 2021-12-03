import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StanfordCS251NFT } from "../typechain";

describe("CS251 Stanford NFT", function () {
  let StanfordCS251NFT: StanfordCS251NFT;
  let minter: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  this.beforeAll(async () => {
    [minter, account1, account2] = await ethers.getSigners();
  });
  beforeEach(async () => {
    const StanfordCS251NFTFactory = await ethers.getContractFactory(
      "StanfordCS251NFT"
    );
    StanfordCS251NFT = await StanfordCS251NFTFactory.deploy();
    await StanfordCS251NFT.deployed();
  });
  it("Should return the correct name", async function () {
    expect(await StanfordCS251NFT.name()).to.equal("Stanford CS251 NFT");
  });
  it("Should be mintable by minter", async function () {
    const tokenURI = "<some URI>";
    const tx = await StanfordCS251NFT.safeMint(account1.address, tokenURI);
    await tx.wait();
    expect(await StanfordCS251NFT.totalSupply()).to.equal(1);
    expect(await StanfordCS251NFT.balanceOf(minter.address)).to.equal(0);
    expect(await StanfordCS251NFT.balanceOf(account1.address)).to.equal(1);

    const tokenId = await StanfordCS251NFT.tokenOfOwnerByIndex(
      account1.address,
      0
    );
    expect(tokenId).to.equal(0);

    const owner = await StanfordCS251NFT.ownerOf(tokenId);
    expect(owner).to.equal(account1.address);
  });
  it("Should not be mintable by non-minter", async function () {
    await expect(
      StanfordCS251NFT.connect(account1).safeMint(
        account1.address,
        "<some URI>"
      )
    ).to.be.revertedWith("");
  });
  it("Should not be transferable by non-minter", async function () {
    const tx = await StanfordCS251NFT.safeMint(account1.address, "<some URI>");
    await tx.wait();
    const tokenId = await StanfordCS251NFT.tokenOfOwnerByIndex(
      account1.address,
      0
    );
    expect(tokenId).to.equal(0);
    await expect(
      StanfordCS251NFT.connect(account1).transferFrom(
        account1.address,
        account2.address,
        tokenId
      )
    ).to.be.revertedWith("");
  });
});
