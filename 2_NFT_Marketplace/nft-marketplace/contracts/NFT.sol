// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    // Counters.Counter private _itemsSold;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
      contractAddress = marketplaceAddress;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI) public payable returns (uint) {
      _tokenIds.increment();
      uint newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
    //   createMarketItem(newTokenId, price);
      setApprovalForAll(contractAddress, true);
      return newTokenId;
    }

    
}