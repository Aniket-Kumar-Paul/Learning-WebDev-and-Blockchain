const { network } = require("hardhat")

const { networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    // extract the above arguments from hre (hardhat runtime environment)
    const { deploy, log } = deployments // get deploy & log functions from deployments object
    const { deployer } = await getNamedAccounts() // get deployer account
    const chainId = network.config.chainId

    // getting price feed address according to the chain
    const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]

    // when we want to deploy in localhost or hardhat network,
    // we will use a mock (as hardhat gets reset everytime, but we want the blocks/contracts in the chain locally)

    // (<name of contract to deploy>, {<list of overrides>})
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], // list of arguments to pass in the constructor (pricefeed address)
        log: true
    })
}
