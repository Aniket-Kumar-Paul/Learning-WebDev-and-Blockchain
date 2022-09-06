const { task } = require("hardhat/config")

// the options you can run when you type, yarn hardhat
// Creating user defined tasks https://hardhat.org/guides/create-task.html
task("block-number", "Prints the current block number").setAction(
    // taskArgs is automatically passed when you call the task
    // hre -> hardhat runtime environment
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    }
)

// to run : yarn hardhat block-number --network goerli

module.exports = {}
