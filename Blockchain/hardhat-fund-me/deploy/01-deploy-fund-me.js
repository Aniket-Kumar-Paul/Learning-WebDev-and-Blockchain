const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    // extract the above arguments from hre (hardhat runtime environment)
    const { deploy, log } = deployments // get deploy & log functions from deployments object
    const { deployer } = await getNamedAccounts() // get deployer account
    const chainId = network.config.chainId
}
