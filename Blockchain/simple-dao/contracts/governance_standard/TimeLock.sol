// We want to wait for a new vote to be "executed"

// Eg: If a proposal comes, which requires everyone who holds the governance token to pay 5 tokens
// The users get time to "get out" if they don't like a governance update

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay: How long you have to wait before executing after a proposal passes
    // proposers: list of addresses that can propose
    // executors: Who can execute when a proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}