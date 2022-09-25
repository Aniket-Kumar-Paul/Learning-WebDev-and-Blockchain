// Raffle (Lottery)
// Enter the lottery by paying some amount
// Pick a random winner (Winner to be selected every X minutes)

// Chainlink Oracle -> Randomness
// Smart contracts can't execute itself, so we need Automated Execution using Chainlink Keepers

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Raffle__NotEnoughETHEntered();

contract Raffle {
    // State Variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // Events
    event RaffleEnter(address indexed player);

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
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

    // function pickRandomWinner() {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
