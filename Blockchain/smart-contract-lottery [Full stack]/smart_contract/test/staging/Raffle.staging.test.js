// will be deployed in a test net not local

// NOTES:- to test this staging test :
// 1. get subId for chainlink VRF & fund it -> add the subid in helper-hardhat-config.js
// 2. deploy our contract using the subId (yarn hardhat deploy --network goerli)
// 3. register the contract with chainlink VRF and it's subId (in subscription (vrf.chain.link), add contract adress as a consumer)
// 4. register the contract with chainlink keepers (keepers.chain.link)
// 5. run staging tests

const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              //   await deployments.fixture(["all"]) --> not required since contract will already be deployed
              raffle = await ethers.getContract("Raffle", deployer)
              //   vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer) --> mock not required since its a test net
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and chainlink VRF, we get a random winner", async function () {
                  // enter the raffle
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  // setup listener before we enter the raffle, just in case the blockchain moves really fast
                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      //   this code wont complete until our listener has finished listening
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add the asserts
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance() // accounts[0] is the deployer
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted // since players array should have been reset
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })

                      //   entering raffle
                      console.log("Entering raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      console.log("Time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
