// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public minimumUSD = 50 * 1e18; 
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    function fund() public payable{
        require(msg.value.getConversionRate() > minimumUSD, "Didn't send enough!");

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value; 
    }

    function withdraw() public{
        // setting funding amount of funders to 0
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        // reset funders array
        funders = new address[](0); // 0 is size

        // withdraw the funds
        // We can send ether to other contracts by 
            // - TRANSFER (2300gas, throws error if more gas is used)
            // - SEND (2300gas, returns bool)
            // - CALL (forward all gas or set gas, returs bool)


        // TRANSFER - transfer funds to address who is calling withdraw function
        // msg.sender-the address that has originated the call
        // convert msg.sender from address type to payable address
        // this -> refers to the whle contract
        // payable(msg.sender).transfer(address(this).balance); 
        // transfer automatically reverts transaction if it fails

        // SEND
        // bool sendSuccess = payable(msg.sender).send(address(this).balance); 
        //require(sendSuccess, "Send Failed!"); // require is necessary for 'send' to revert the transaction if it fails

        // CALL (recommended to send & receive ethereum)
        // .call(info about any function call)
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}(""); // dataReturned will have any values from functions inside .call(..)
        require(callSuccess, "Call Failed");
    }
}