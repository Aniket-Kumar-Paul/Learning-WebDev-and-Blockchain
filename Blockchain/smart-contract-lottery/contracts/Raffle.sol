// Raffle (Lottery)
// Enter the lottery by paying some amount
// Pick a random winner (Winner to be selected every X minutes)

// Chainlink VRF(verifiable random function) -> Randomness
// Smart contracts can't execute itself, so we need Automated Execution using Chainlink Keepers

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2 {
    // State Variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint16 private constant NUM_WORDS = 1;

    // Lottery Variables
    address private s_recentWinner;

    // Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        s_players.push(payable(msg.sender));

        // Emit an event whenever updating any dynamic array or mapping
        // Named events with function name reversed
        emit RaffleEnter(msg.sender);
    }

    // requestRandomWinner() function is going to be called by chainlink keeper
    // get a random number
    function requestRandomWinner() external {
        // request random no.
        // do something with it
        // 2 transaction process

        // Will revert if subscription is not set and funded.
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // gas lane key hash (max gas price in wei)
            i_subscriptionId, // subscription id of the chainlink subscription to fund
            REQUEST_CONFIRMATIONS, // how many confirmations chainlink node should wait before responding
            i_callbackGasLimit, // limit for how much gas to use for the callback request to your contract's fulfillRandomWords() function
            NUM_WORDS // number of random words required
        );

        emit RequestedRaffleWinner(requestId);
    }

    // what to do after getting the random number?
    // pick random winner from s_players array
    function fulfillRandomWords(
        uint256, // requestId
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        // send all the balance of this contract to the winner with no data ("")
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }

        // to keep track of all winners, emit an event
        emit WinnerPicked(recentWinner);
    }

    // View / Pure functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
