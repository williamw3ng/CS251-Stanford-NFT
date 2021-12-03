import { ERC721MetadataStandard } from "../types";
import { uploadAndMintNFT } from "./uploadAndMintNFTLib";

/**
 * Note: Same image or metadata may only be uploaded once to IPFS
 * since content hashes must not crash. If image or metadata already
 * exists in IPFS, uploadAndMintNFT will fail.
 */
async function main() {
  const to = "0xD0812dd01FFF451c2e6fFA83c448714DC60917FD";
  const deployedMumbaiAddress = "0xC818DCd7265Ddf7A47642719253ED3BF3A96DBaD"; // TODO
  const metadataWithoutImage: Omit<ERC721MetadataStandard, "image"> = {
    description: "Stanford CS251 non-transferable NFT for class attendance",
    external_url: "https://cs251.stanford.edu",
    name: "Stanford CS251 NFT",
  };
  const imageFilename = `./images/stanford.jpg`;
  const tokenId = await uploadAndMintNFT(
    to,
    deployedMumbaiAddress,
    metadataWithoutImage,
    imageFilename
  );
  console.log(`Successfully deployed tokenID: ${tokenId}`);
}

// uncomment this to call
main().catch((err) => console.error(err));
