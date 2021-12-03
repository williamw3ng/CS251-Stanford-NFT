import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StanfordCS251NFT } from "../typechain";
import { uploadAndMintNFT } from "../scripts/uploadAndMintNFTLib";
import { ERC721MetadataStandard } from "../types";

/**
 * Note: Uploaded image and metadata must be deleted from IPFS after every run.
 * Make sure the image and metadata do not already exist in IPFS.
 */
describe("uploadAndMintNFT", function () {
  let StanfordCS251NFT: StanfordCS251NFT;
  let minter: SignerWithAddress;
  let account1: SignerWithAddress;
  this.beforeAll(async () => {
    [minter, account1] = await ethers.getSigners();
  });
  beforeEach(async () => {
    const StanfordCS251NFTFactory = await ethers.getContractFactory(
      "StanfordCS251NFT"
    );
    StanfordCS251NFT = await StanfordCS251NFTFactory.deploy();
    await StanfordCS251NFT.deployed();
  });
  it("Should run successfully", async function () {
    const metadataWithoutImage: Omit<ERC721MetadataStandard, "image"> = {
      description: "Stanford CS251 non-transferable NFT for class attendance",
      external_url: "https://cs251.stanford.edu",
      name: "Stanford CS251 NFT",
    };
    const imageFilename = `./images/stanford.jpg`;
    const [tokenId, metadataIPFSHash] = await uploadAndMintNFT(
      account1.address,
      StanfordCS251NFT.address,
      metadataWithoutImage,
      imageFilename
    );
    expect(tokenId.toNumber()).to.equal(0);
    expect(await StanfordCS251NFT.tokenURI(tokenId)).to.equal(
      `ipfs://${metadataIPFSHash}`
    );
  });
});
