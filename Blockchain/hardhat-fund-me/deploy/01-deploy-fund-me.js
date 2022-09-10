const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    // extract the above arguments from hre (hardhat runtime environment)
    const { deploy, log } = deployments // get deploy & log functions from deployments object
    const { deployer } = await getNamedAccounts() // get deployer account
    const chainId = network.config.chainId

    // getting price feed address according to the chain
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // local chain
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // get recent deployment
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // when we want to deploy in localhost or hardhat network,
    // we will use a mock (as hardhat gets reset everytime, but we want the blocks/contracts in the chain locally)

    // (<name of contract to deploy>, {<list of overrides>})
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // list of arguments to pass in the constructor (pricefeed address)
        log: true
    })
    log("_____________________________________________________")
}

module.exports.tags = ["all", "fundme"]
