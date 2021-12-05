import { ethers } from "ethers";

const MUMBAI_RPC_URL = "https://matic-mumbai.chainstacklabs.com";
const MUMBAI_CONTRACT_ADDRESS = "0x76fd6Fe501d55d51F589565564b0ABC7C0A01F5d";
const PRIVATE_KEY = ""; // TODO: Add your private key
const NONCE = NaN; // TODO: Add the nonce you want to claim
const SIGNATURE = ""; // TODO: Add the nonce signature you need to claim

const ABI = ["function mint(uint256 nonce, bytes memory signature)"];

/**
 * To run:
 *   yarn hardhat run scripts/claimToken.ts
 */

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY).connect(provider);
  console.log(`Connected to chainId ${(await wallet.provider.getNetwork()).chainId}`);
  console.log(`Claiming token with account ${wallet.address}`);
  console.log(`Contract address ${MUMBAI_CONTRACT_ADDRESS}`);
  console.log(`Claiming token with nonce ${NONCE}, signature ${SIGNATURE}`);
  const StanfordCS251NFT = new ethers.Contract(MUMBAI_CONTRACT_ADDRESS, ABI, wallet);
  const tx = await StanfordCS251NFT.mint(NONCE, SIGNATURE);
  await tx.wait();
  console.log("Claimed token successfully");
  console.log(`txHash: ${tx.hash}`);
}

main().catch(console.error);
