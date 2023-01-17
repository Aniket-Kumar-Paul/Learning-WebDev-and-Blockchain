import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import * as fs from "fs";
// @ts-ignore
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // Vote :-
  // 0 = Against
  // 1 = For
  // 2 = Abstain
  // voteCastBySig -> implements a meta-transaction, and allows a project to subsidize voting fees.
  // The voters can generate a signature for free, and the project can then submit those and pay for the gas.
  // It also allows the snapshot chain link integration.

  // But, since we're not implementing these meta transactions, (the off chain stuff),
  // we're going to use castVoteWithReason

  const voteWay = 1; // For
  const governor = await ethers.getContract("GovernorContract");
  const reason = "Cause I wanna vote";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted! Ready to go..");

  // You can check the state of the proposal using
  // await governor.state(proposals[network.config.chainId!][proposalIndex])
  // state = 4 means Succeeded (check for others in IGovernor.sol in openzepellin)
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
