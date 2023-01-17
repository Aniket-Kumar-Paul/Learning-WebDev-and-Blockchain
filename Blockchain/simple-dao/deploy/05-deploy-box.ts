import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// @ts-ignore
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Box...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true
  });

  // Right now, the deployer has actually deployed it and not our time lock
  // We want to give the ownership of this box contract to the governance process
  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);
  const transferOwnerTx  = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("It's done!!!");
};

export default deployBox;