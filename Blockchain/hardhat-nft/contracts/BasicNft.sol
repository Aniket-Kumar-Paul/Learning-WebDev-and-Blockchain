// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_tokenCounter;

    // ERC721 constructor takes name and symbol
    constructor() ERC721("Dogie", "DOG") {
        // our constructor is empty, and pass the values to ERC721 constructor
        s_tokenCounter = 0;
    }

    function mintNft() public {
        // _safeMint(address to, uint256 tokenId, bytes memory data (optional))
        // Safely mints `tokenId` and transfers it to `to`
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, s_tokenCounter);
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public pure override returns (string memory) {
        // require(_exists(tokenId));
        // everyone will have the same NFT(TOKEN_URI) in this contract
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
