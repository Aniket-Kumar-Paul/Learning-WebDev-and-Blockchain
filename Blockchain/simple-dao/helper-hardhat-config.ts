export const MIN_DELAY = 3600; // 1 hour, after a vote passes, you have 1 hour before you can enact
export const VOTING_PERIOD = 5; // 5 blocks, how long the vote lasts
export const VOTING_DELAY = 1; //1 block, how many blocks till a proposal vote becomes active
export const QUORUM_PERCENTAGE = 4; // 4% of voters need to have voted for a vote to pass
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const NEW_STORE_VALUE = 77;
export const FUNC = "store"
export const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box!"

export const developmentChains = ["hardhat", "localhost"];
export const proposalsFile = "proposals.json";