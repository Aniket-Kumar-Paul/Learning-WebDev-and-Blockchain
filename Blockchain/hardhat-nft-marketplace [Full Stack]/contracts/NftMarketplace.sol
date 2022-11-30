// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();

contract NftMarketplace {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // {NFT Contract Address -> {NFT tokenID -> Listing}}
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // ---------------------------------------------------------------
    // MODIFIERS
    // ---------------------------------------------------------------
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _; // _ tells solidity to execute rest of the code
    }
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    // ---------------------------------------------------------------
    // MAIN FUNCTIONS
    // ---------------------------------------------------------------

    // To list the NFT, we can either
    // 1. Send the NFT to the contract. Transfer -> Contract "hold" the NFT
    // 2. Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them
    // Here, we will use the 2nd way

    /* 
     * @notice Method for listing NFT on marketplace
     * @param nftAddress: Address of the NFT
     * @param tokenId: token ID of the NFT
     * @param price: sale price of the listed NFT
     * @dev Technically, we could have the contract be the escrow for the NFTs
     * but this way people can still hold their NFTs when listed
    */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender) // make sure nftAddress isn't already listed using the modifier
        isOwner(nftAddress, tokenId, msg.sender) // make sure sender is the owner
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }

        // Approve this marketplace
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }

        // Emit event, since we're updating the mapping
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }
}
