const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// Hardhat test runs with the mochajs framework
describe("SimpleStorage", function () {
    // what to do before the below its - deploy the contract
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    // it -> the testing functions
    // (what action to do, the function to perform the action)
    it("Favourite number should be 0 at start", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update on calling store()", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
        // we can also use expect instead of assert
    })

    // we can also have nested describe()
})

// to run only a particular test / it()
// > yarn hardhat test --grep <keyword in the description/eg: store>
// or, put it.only() to run that particular test and run yarn hardhat test
