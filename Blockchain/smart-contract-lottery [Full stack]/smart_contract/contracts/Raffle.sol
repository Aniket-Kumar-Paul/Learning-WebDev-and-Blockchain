// Raffle (Lottery)
// Enter the lottery by paying some amount
// Pick a random winner (Winner to be selected every X minutes)

// Chainlink VRF(verifiable random function) -> Randomness
// Smart contracts can't execute itself, so we need Automated Execution using Chainlink Keepers

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__NotOpen();
error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

/**
 * @title A sample Raffle Contract
 * @author Aniket Kumar Paul
 * @notice This contract is for creating an untamperable decentralized smart contract
 * @dev This implements Chainlink VRF V2 and Chainlink automation
 */

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    // Type declaraions
    enum RaffleState {
        OPEN,
        CALCULATING
    } // uint256 0=>OPEN, 1=>CALCULATING

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
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    // Events
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    // Functions
    constructor(
        address vrfCoordinatorV2, // contract address (use mocks for development chain and actual contract address for real chain)
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }

        s_players.push(payable(msg.sender));

        // Emit an event whenever updating any dynamic array or mapping
        // Named events with function name reversed
        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev This is the function that chailink keeper/automation nodes call
     * They look for the upkeep needed to return true
     * For upkeep to be true / random winner to be selected :-
     * 1. lottery should be in "open" state (open->new players can join, closed->new players can't join until random winner is found)
     * 2. our time interval should have passed
     * 3. lottery should have atleast 1 player and have some ETH
     * 4. our subscription is funded with LINK
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    // requestRandomWinner() function is going to be called by chainlink keeper
    // get a random number
    // function requestRandomWinner() external
    // rename function to performUpKeep as only this function has to run if upkeepNeed is true
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }

        // request random no.
        // do something with it
        // 2 transaction process
        s_raffleState = RaffleState.CALCULATING;

        // Will revert if subscription is not set and funded.
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // gas lane key hash (max gas price in wei)
            i_subscriptionId, // subscription id of the chainlink subscription to fund
            REQUEST_CONFIRMATIONS, // how many confirmations chainlink node should wait before responding
            i_callbackGasLimit, // limit for how much gas to use for the callback request to your contract's fulfillRandomWords() function
            NUM_WORDS // number of random words required
        );

        // the requestRandomWords function itself emits and event which also includes requestId
        // so below emit is redundant actually
        // and in test, we txReceipt.events[1] because .events[0] is the one emitted by i_vrfCoordinator.requestRandomWords
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
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0); // reset players array
        s_lastTimeStamp = block.timestamp;

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

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}
