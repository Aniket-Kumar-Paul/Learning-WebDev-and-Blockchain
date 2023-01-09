// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000; // 1 million tokens

    constructor()
        ERC20("GovernanceToken", "GT")
        ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, s_maxSupply);
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}

// This is not a normal token
// It will be used for voting purpose in the dao

// Whenever there is a hot proposal coming up,
// Someone can just buy a ton of tokens and then dump it after voting is over
// We want to avoid this

// Therefore, we will create a snapshot of how many tokens someone has at a certain block
// We want to make sure, once a proposal goes through,
// we pick a snapshot from the past that we want to use

// This kind of incentivizes people to not just jump in when it's a proposal and jump out once a proposal hits
