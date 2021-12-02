// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * Created using Open Zeppelin contract wizard at
 * https://docs.openzeppelin.com/contracts/4.x/wizard
 *
 * Features: Mintable, Auto Increment Ids, Enumerable, Roles
 *
 * Rationale:
 * - Mintable: We want to mint new NFTs for each new class member
 * - Auto Increment Ids: Makes minting easier
 * - Enumerable: totalSupply() can be queried on-chain for convenience
 *     in exchange for extra gas cost on transfer. Since we want it
 *     to be non-transferable this is of no concern
 * - Roles: Only minter should be able to mint and transfer
 *          Owner === minter should renounce ownership
 */

/// @custom:security-contact cs251ta@cs.stanford.edu
contract CS251StanfordNFT is ERC721, ERC721Enumerable, AccessControl {
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("CS251-Stanford-NFT", "CS251") {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://<TBD>";
  }

  function safeMint(address to) public onlyRole(MINTER_ROLE) {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
