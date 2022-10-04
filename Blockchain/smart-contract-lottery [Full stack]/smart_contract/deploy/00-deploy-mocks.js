const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

// check the coordinator flat fee https://docs.chain.link/docs/vrf/v2/direct-funding/supported-networks/
// i.e it takes 0.25LINKS / ethers per request
const BASE_FEE = ethers.utils.parseEther("0.25")
// (link per gas) calculated value based on the gas price of the chain
const GAS_PRICE_LINK = 1e9 // (using a random no. for now)

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks..")

        // deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args, // see what are the args in the constructor of VRFCoordinatorV2Mock
        })
        log("Mocks Deployed!")
        log("-------------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
