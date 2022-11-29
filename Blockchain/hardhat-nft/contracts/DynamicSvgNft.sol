// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    // mint function to mint the nfts
    // store SVG information somewhere
    // logic to decide which image/svg to show

    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256) public s_tokenIdToHighValue;

    // Event
    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    // when price of asset is low, show frown svg, and happy svg if price is high
    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_lowImageURI = svgToImageURI(lowSvg);
        i_highImageURI = svgToImageURI(highSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded)); // the abi.encodePacked concatenates them
    }

    function mintNft(int256 highValue) public {
        // each nft will have its high value, i.e more than which will show the happy svg
        s_tokenIdToHighValue[s_tokenCounter] = highValue;

        // here we let to mint without paying anything (but shouldn't be the case in real)
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;

        emit CreatedNFT(s_tokenCounter, highValue);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // overried tokenURI function of ERC721
        require(_exists(tokenId), "URI Query for nonexistent token");

        // get the current price
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        string memory imageURI = i_lowImageURI;
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageURI = i_highImageURI;
        }

        // encoding the json to bytes then base64 and prefix with the baseURI and encode again
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description": "An NFT that changes based on the ChainLink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 200}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
