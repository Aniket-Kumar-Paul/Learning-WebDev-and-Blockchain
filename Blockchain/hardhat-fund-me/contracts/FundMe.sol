// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.9;

// Imports
import "./PriceConverter.sol";

// We can save gas by using custom errors instead of using require() which stores strings for error messages
// Error
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts

// Below comment is useful for generating automatic documentation using:
// solc --userdoc --devdoc FundMe.sol
/**
 * @title FundMe - A contract for crowd funding
 * @author Aniket
 * @notice This contract is to demo a sample funding contract
 * @dev [message for developers] This implements price feeds as our library
 */

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    // State Variables
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    // Modifier
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only Owner can withdraw funds!");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // Functions Order :-
    // constructor
    // receive
    // fallback
    // external
    // public
    // internal
    // private
    // view / pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender; // whoever deployed the contract
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     */
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
}
