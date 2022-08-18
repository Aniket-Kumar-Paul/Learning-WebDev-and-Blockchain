// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 * 1e18; 
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public owner;

    constructor() {
        owner = msg.sender; // whoever deployed the contract
    }

    function fund() public payable{
        require(msg.value.getConversionRate() > minimumUSD, "Didn't send enough!");

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
        // _ means the code inside function which which will have this modifier
        // any function with this modifier will first call the below require statement
        // and then run the function code
        // but if _ was above, then first function code is run and then the requrie statement
        require(msg.sender == owner, "Only Owner can withdraw funds!");
        _;
    }
}