// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice() internal view returns(uint256){ // returns value of 1ETH in USD
        // using chainlink data feeds
        // Address (Go to chainlink ethereum data feeds, search for ETH/USD for your testnet) - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // ABI
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        // (uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound) = priceFeed.latestRoundData();
        (,int256 price,,,) = priceFeed.latestRoundData(); // we only need price
        // the above is price of ETH in USD
        // there are 8 decimal places associated with the price field
        return uint256(price * 1e10); // to match with decimal places of msg.value
    }   

    function getConversionRate(uint256 ethAmount) internal view returns (uint256){ // Convert ETH to USD
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUSD;
    }
}