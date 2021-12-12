// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Created with help of Open Zeppelin contract wizard at
 * https://docs.openzeppelin.com/contracts/4.x/wizard
 *
 * Features: Enumerable, Ownable
 *
 * - Enumerable: totalSupply() can be queried on-chain for convenience
 *     in exchange for extra gas cost on transfer. Since we want it
 *     to be non-transferable this is of no concern.
 * - Owner: owner's address is the only one who can produce valid
 *     mint signatures
 *
 * Custom features: Non-transferable, publicly mintable with valid signature
 *
 */

/// @custom:security-contact cs251ta@cs.stanford.edu
contract StanfordCS251NFT is ERC721, ERC721Enumerable, Ownable {
  constructor() ERC721("Stanford CS 251 NFT", "CS 251") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://Qmdg6D59xxsVspPn5mYquh2ZVVUsX3YXbLmit9yYzz2zwJ"; // TODO
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // -------- CUSTOM LOGIC ---------------------------

  function mint(uint256 nonce, bytes memory signature) public {
    require(!_exists(nonce), "Token already minted");
    require(verifySignature(nonce, signature, owner()), "Invalid signature");
    _safeMint(msg.sender, nonce);
  }

  // See https://solidity-by-example.org/signature/
  function verifySignature(
    uint256 nonce,
    bytes memory signature,
    address minter
  ) public pure returns (bool) {
    bytes32 message = getMessageHash(nonce);
    (uint8 v, bytes32 r, bytes32 s) = getVRSFromSignature(signature);
    return ecrecover(message, v, r, s) == minter;
  }

  /**
   * Signature is produced by signing a keccak256 hash with the following format:
   * "\x19Ethereum Signed Message\n" + len(msg) + msg
   * See EIP-191.
   */
  function getMessageHash(uint256 nonce) public pure returns (bytes32) {
    bytes32 message = keccak256(abi.encodePacked(nonce));
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
  }

  function getVRSFromSignature(bytes memory signature)
    public
    pure
    returns (
      uint8 v,
      bytes32 r,
      bytes32 s
    )
  {
    require(signature.length == 65, "Invalid signature length");
    // solhint-disable-next-line no-inline-assembly
    assembly {
      r := mload(add(signature, 32))
      s := mload(add(signature, 64))
      v := byte(0, mload(add(signature, 96)))
    }
  }

  /**
   * Override Open Zeppelin's tokenURI() since it concatenates tokenId to
   * baseURI by default, but each token contains the same metadata.
   */
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return _baseURI();
  }

  // Non-transferability
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    require(from == address(0), "Token is not transferable");
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
