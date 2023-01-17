import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// @ts-ignore
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../helper-hardhat-config";

const setupContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);

  log("Setting up roles...");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  // We want to allow only the governor to propose to timelock, not anyone else, not even the deployer
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address); // grant proposerRole to the governor
  await proposerTx.wait(1);
  // We are going to give the executor role to... nobody, which actually means everybody
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);
  // We were able to grantRoles above, because the deployer was the admin
  // now since we have granted the roles, we want to revoke the deployer as admin to make it decentralized
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

export default setupContracts;
