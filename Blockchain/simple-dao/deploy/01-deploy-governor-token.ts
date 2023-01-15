import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

// : DeployFunction (type)
const deployGovernanceToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    log("Deploying Governance Token...");

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations:
    });
    //verify
    log(`Deployed governance token to address ${governanceToken.address}`)
}

export default deployGovernanceToken;