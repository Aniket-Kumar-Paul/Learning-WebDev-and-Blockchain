// @ts-ignore
import { ethers, network } from "hardhat";
import {
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  // In openzeppelin-contracts/contracts/governance/Governor.sol,
  // the propose function takes parameters :-
  //   address[] memory targets -> targets that we wanna call functions on (here, box.sol)
  //   uint256[] memory values -> how much eth we want to send (none here)
  //   bytes[] memory calldatas -> encoded parameters for the function
  //   string memory description

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);

  // since we have a voting delay, people can't vote until voting delay passes
  // for the local environment, we'll do the following for testing purposes
  if (developmentChains.includes(network.name)) {
    // we move the blocks forward (as no one is there in the local environment)
    await moveBlocks(VOTING_DELAY+1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  }); // new
