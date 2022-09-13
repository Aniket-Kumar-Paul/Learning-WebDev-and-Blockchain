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

    // State Variables
    // prefix storage variables with s_
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface public s_priceFeed;

    // prefix immutable variables with i_ (not stored in storage)
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

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
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
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
            msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
            "You need to spend more ETH!"
        );

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public payable onlyOwner {
        // setting funding amount of funders to 0
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length; // very expensive
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        // reset funders array
        s_funders = new address[](0);

        // withdraw the funds
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); // dataReturned will have any values from functions inside .call(..)
        require(callSuccess, "Call Failed");

        // revert() -> we can revert transactions anywhere in code
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders; // copy in memory and read/write in that instead of storage

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0; // mapping can't be stored in memory, so we have to use storage only here
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    // View/Pure functions
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
