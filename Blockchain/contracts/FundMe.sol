// Get funds from users
// Owner of the contract(the one who deploys) can withdraw funds
// set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol"

contract FundMe {
    using PriceConverter for uint256; // we can use functions in library using . for uint256 variables

    uint256 public minimumUSD = 50 * 1e18; // 50 dollar (but to match with converted value, 1e18)
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // public - anyone can call the function
    // payable - the function can send and receive ether into the contract
    // smart contracts can hold funds just like how wallets can
    function fund() public payable{ 
        // msg - global variable that has properties which allow access to blockchain
        // msg.sender -> address where current(external) function call came from
        // msg.data, msg.gas, msg.sig, msg.value(amount of wei sent)
        
        // set min. value as 1eth
        // if its less than revert back with the message
        // reverting -> undo any action before, & send remaining gas back
        // require(msg.value > 1e18, "Didn't send enough!"); // 1e18 = 1 * 10^18 = 10^18 wei = 1eth
        require(msg.value.getConversionRate() > minimumUSD, "Didn't send enough!");
        // msg.value gets passed as the first argument to the getConversionRate function
        // msg.value has 18 decimal places (1ETH = 10^18wei)

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value; 
    }

    // function withdraw() {

    // }
}