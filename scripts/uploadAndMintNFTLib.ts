import { BigNumber } from "@ethersproject/bignumber";
import pinataSDK, { PinataClient } from "@pinata/sdk";
import { ethers } from "hardhat";
import { StanfordCS251NFT } from "../typechain";
import { TransferEvent } from "../typechain/StanfordCS251NFT";
import fs from "fs";
import { ERC721MetadataStandard } from "../types";

async function mintNFT(
  to: string,
  metadataIPFSHash: string,
  contractAddress: string
): Promise<BigNumber> {
  const [minter] = await ethers.getSigners();
  if (!minter) throw new Error("No minter configured");

  // verify ICAP Address checksum, revert on error
  const verifiedToAddress = ethers.utils.getAddress(to);
  const StanfordCS251NFT: StanfordCS251NFT = await ethers.getContractAt(
    "StanfordCS251NFT",
    contractAddress
  );

  const tx = await StanfordCS251NFT.safeMint(
    verifiedToAddress,
    metadataIPFSHash
  );
  const receipt = await tx.wait();

  if (!receipt.events)
    throw new Error("Minting should always triger Transfer event");

  // retrieve tokenId
  for (const event of receipt.events) {
    if (event.event !== "Transfer") {
      console.log("ignoring unknown event type ", event.event);
      continue;
    }
    const transferEvent = event as TransferEvent;
    return transferEvent.args.tokenId;
  }
  throw new Error("Unable to retrieve tokenId, are you connected to network?");
}

async function uploadImageToIPFS(
  filename: string,
  pinataClient: PinataClient
): Promise<string> {
  const readStream = fs.createReadStream(filename);
  const pinnedImage = await pinataClient.pinFileToIPFS(readStream);
  return pinnedImage.IpfsHash;
}

async function uploadMetadataToIPFS(
  metadata: ERC721MetadataStandard,
  pinataClient: PinataClient
): Promise<string> {
  const pinnedMetadata = await pinataClient.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: "NFT Metadata" },
  });
  return pinnedMetadata.IpfsHash;
}

async function getPinataClient(): Promise<PinataClient> {
  const pinataPrivateKey = process.env.PINATA_TESTNET_API_KEY;
  const pinataSecretKey = process.env.PINATA_TESTNET_SECRET_KEY;
  if (!pinataPrivateKey || !pinataSecretKey)
    throw new Error("Unable to retrieve Pinata keys");
  const pinataClient = pinataSDK(pinataPrivateKey, pinataSecretKey);
  const { authenticated } = await pinataClient.testAuthentication();
  if (!authenticated) throw new Error("Not authenticated with Pinata");
  return pinataClient;
}

export async function uploadAndMintNFT(
  to: string,
  contractAddress: string,
  metadataWithoutImage: Omit<ERC721MetadataStandard, "image">,
  imageFilename: string
): Promise<[BigNumber, string]> {
  const pinataClient = await getPinataClient();
  console.log("uploading image...");
  const imageIPFSHash = await uploadImageToIPFS(imageFilename, pinataClient);
  const metadata: ERC721MetadataStandard & { owner: string } = {
    ...metadataWithoutImage,
    image: `ipfs://${imageIPFSHash}`,
    owner: to,
  };
  console.log("image uploaded");
  console.log("uploading metadata...");
  const metadataIPFSHash = await uploadMetadataToIPFS(metadata, pinataClient);
  console.log("metadata uploaded...");
  const tokenId = await mintNFT(to, metadataIPFSHash, contractAddress);
  return [tokenId, metadataIPFSHash];
}
