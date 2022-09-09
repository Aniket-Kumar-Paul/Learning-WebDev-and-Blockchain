// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./PriceConverter.sol";

// We can save gas by using custom errors instead of using require() which stores strings for error messages
error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender; // whoever deployed the contract
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) > MINIMUM_USD,
            "Didn't send enough!"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        // setting funding amount of funders to 0
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        // reset funders array
        funders = new address[](0);

        // withdraw the funds
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); // dataReturned will have any values from functions inside .call(..)
        require(callSuccess, "Call Failed");

        // revert() -> we can revert transactions anywhere in code
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only Owner can withdraw funds!");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    // What happens if someone sends this contract ETH but without calling fund function ?
    // we won't be able to track the funders as that happens inside the fund function

    // to solve this, we can use receive()
    // - at most one receive function in a contract
    // - can't have an argument or return
    // - must have external visibility and payable state mutability
    // - can be virtual, override and can have modifiers
    // - receive function is executed on calling contract with empty calldata, i.e on plain ether transfers
    // - Eg. via .send or .transfer, payable fallback() function is called if no such function exists
    // - it must have either receive or fallback function to receive plain ether
    receive() external payable {
        fund();
    }

    // fallback()
    fallback() external payable {
        fund();
    }

    // Overall, if we send plain ether with calldata, fallback() is called, without data receive() is called
    // if plain ether with no calldata is called, but receive() doesn't exist, fallback is called
}
