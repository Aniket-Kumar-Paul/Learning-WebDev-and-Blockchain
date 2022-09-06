// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    //DEPLOY
    // by default, deployed in hardhat network (local eth node)
    // which automatically uses fake private key and rpc url for development

    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract..")
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Contract deployed to: ${simpleStorage.address}`)

    // VERIFY IF NOT IN HARDHAT NETWORK
    // console.log(network.config) -> shows details about the current network
    // here we can see (if using hardhat), chainId is 31337
    // we can't verify in hardhat network in etherscan as it is local
    if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations..")
        await simpleStorage.deployTransaction.wait(6) // wait for 6 blocks before verifying
        await verify(simpleStorage.address, []) // no constructor arguments []
    }

    // RETRIEVE AND UPDATE FAVOURITE NUMBER IN THE CONTRACT
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current favourite number: ${currentValue}`)
    // Update current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`New favourite number: ${updatedValue}`)
}

// verification
async function verify(contractAddress, args) {
    console.log("Verifying contract..")
    // look at all options available for run (yarn hardhat)
    // yarn hardhat verify --help
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified"))
            console.log("Already Verified")
        else console.log(e)
    }
}

// call main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
