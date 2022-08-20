// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

// For variables, which get set only once(Eg.minimumUSD, owner), 
// we can use constant, immutable keywords to make it more gas efficient
// they save gas because these variables are directly stored into the byte code
// of the contract instead of storage

contract FundMe {
    using PriceConverter for uint256;

    // constants must be declared and initialized in same line
    // constants must be all caps with _
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // immutable is similar to constant but can be initialized later
    // naming convention is using i_ as a prefix
    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender; // whoever deployed the contract
    }

    function fund() public payable{
        require(msg.value.getConversionRate() > MINIMUM_USD, "Didn't send enough!");

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value; 
    }

    function withdraw() public onlyOwner{
        // setting funding amount of funders to 0
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        // reset funders array
        funders = new address[](0);

        // withdraw the funds
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}(""); // dataReturned will have any values from functions inside .call(..)
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner {
        require(msg.sender == i_owner, "Only Owner can withdraw funds!");
        _;
    }
}