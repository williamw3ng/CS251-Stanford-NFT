// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * Created using Open Zeppelin contract wizard at
 * https://docs.openzeppelin.com/contracts/4.x/wizard
 *
 * Features: Mintable, Auto Increment Ids, Enumerable, Roles
 *
 * Rationale:
 * - Mintable: We want to mint new NFTs for each new class member.
 * - Auto Increment Ids: Automate tokenId increment.
 * - URI Storage: Since we are using IPFS to host metadata, we can't add
 *     images dynamicly to predefined IPFS CIDs like
 *     `ipfs://<Predefined CID>/<tokenID>-metadata.json`
 *     Thus we need to specify the CID on mint. Most projects that use IPFS
 *     either do this, or have pre-uploaded all the tokens metadata to IPFS.
 * - Enumerable: totalSupply() can be queried on-chain for convenience
 *     in exchange for extra gas cost on transfer. Since we want it
 *     to be non-transferable this is of no concern.
 * - Roles: Only minter should be able to mint and transfer.
 *          The owner (also minter) should renounce ownership.
 *
 * Requirement: Non-transferable (see _beforeTokenTransfer override)
 */

/// @custom:security-contact cs251ta@cs.stanford.edu
contract StanfordCS251NFT is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  AccessControl
{
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("Stanford CS251 NFT", "CS251") {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function safeMint(address to, string memory uri)
    public
    onlyRole(MINTER_ROLE)
  {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    // Note: not part of standard Open Zeppelin implementation
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not minter");
    //
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
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
