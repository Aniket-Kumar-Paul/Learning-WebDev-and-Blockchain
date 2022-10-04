const { run } = require("hardhat")

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
        if (e.message.toLowerCase().includes("already verified")) console.log("Already Verified")
        else console.log(e)
    }
}

module.exports = { verify }
