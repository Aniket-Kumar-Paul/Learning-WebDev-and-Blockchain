const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("initializes the raffle correctly", async function () {
                  // Ideally, we make our tests have just 1 assert per 'it'
                  const raffleState = await raffle.getRaffleState()

                  assert.equal(raffleState.toString(), "0") // 0->OPEN
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__NotEnoughETHEntered"
                  )
              })

              it("records players when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer)
              })

              it("emits event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })

              it("doesn't allow entrance when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })

                  // faking interval to allow the checkUpKeep to return true without waiting
                  // for 30 seconds (interval)
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])

                  // mine one extra block (faking)
                  await network.provider.send("evm_mine", [])

                  // we pretend to be a chainlink keeper
                  await raffle.performUpkeep([])

                  await expect(
                      raffle.enterRaffle({ value: raffleEntranceFee })
                  ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen")
              })
          })

          describe("checkUpkeep", function () {
              it("returns false if people haven't sent any ETH", async function () {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  //   await raffle.checkUpkeep([]) --> this will send a transaction since it's a public method (it wouldn't if it was public view)
                  //   but we don't want to send a transaction, so we can simulate the transaction using callstatic
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })

              it("returns false if raffle isn't open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert.equal(raffleState.toString(), "1")
                  assert.equal(upkeepNeeded, false)
              })

              it("returns false if enough time hasn't passed", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 10])
                  //   await network.provider.send("evm_mine", [])
                  await network.provider.request({ method: "evm_mine", params: [] }) // another way to do the same thing
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(!upkeepNeeded)
              })

              it("returns true if enough time has passed, has players, eth and is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", function () {
              it("it can only run if checkUpkeep is true", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const transaction = await raffle.performUpkeep([])
                  assert(transaction)
              })

              it("reverts when checkUpkeep is false", async function () {
                  await expect(raffle.performUpkeep([])).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__UpkeepNotNeeded"
                  )
              })

              it("updates the raffle state, emits and events, and calls vrf coordinator", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const txResponse = await raffle.performUpkeep([])
                  const txReceipt = await txResponse.wait(1)
                  const requestId = txReceipt.events[1].args.requestId // check Raffle.sol to know why .events[1] and not .events[0]
                  const raffleState = await raffle.getRaffleState()
                  assert(requestId.toNumber() > 0)
                  assert(raffleState.toString() == "1")
              })
          })

          describe("fulfillRandomWords", function () {
              beforeEach(async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
              })

              it("can only be called after performUpkeep", async function () {
                  // .fullfillRandomWords(_requestId, _consumerAddress)
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
                  // NOTE :- no requestid will allow fulfillRandomWords to go through
                  // but we are just checking for 2
                  // to check a tone of numbers, we can use fuzz testing (will learn later on)
              })

              it("picks a winner, resets the lottery, and sends money", async function () {
                  const additionalEntrants = 3
                  const startingAccountIndex = 1 // since, deployerIndex = 0
                  const accounts = await ethers.getSigners()
                  for (
                      let i = startingAccountIndex;
                      i < startingAccountIndex + additionalEntrants;
                      i++
                  ) {
                      const accountConnectedRaffle = raffle.connect(accounts[i])
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }

                  const startingTimeStamp = await raffle.getLatestTimeStamp()

                  // we want to performUpkeep (which is going to mock being chainlink keepers)
                  // will inturn call fulfillRandomWords (mock being the chainlinkVRF)
                  // and then we can check if everything got reset etc.. as in fullfillRandomWords function
                  // but We will have to wait for the fulfillRandomWords to be called
                  // Inorder to simulate the waiting, we need to set up a listener
                  // and we don't want the test to finish before the listener is done listening
                  // we do this using promise

                  await new Promise(async (resolve, reject) => {
                      // listen for the event and do the stuff
                      // (<event>, <function to do stuff>)
                      raffle.once("WinnerPicked", async () => {
                          console.log("Found the event!")

                          // if the event doesn't get fired in 200sec(timeout in hardhat.config.js),
                          // it will considered as failure and the test will fail
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              console.log(recentWinner)

                              //   console.log(accounts[2].address)
                              //   console.log(accounts[0].address)
                              //   console.log(accounts[1].address)
                              //   console.log(accounts[3].address)
                              //   by comparing with recentWinner, we see aacounts[1] is the winner

                              const raffleState = await raffle.getRaffleState()
                              assert.equal(raffleState.toString(), "0")

                              const endingTimeStamp = await raffle.getLatestTimeStamp()
                              assert(endingTimeStamp > startingTimeStamp)

                              const numPlayers = await raffle.getNumberOfPlayers()
                              assert.equal(numPlayers.toString(), "0")

                              const winnerEndingBalance = await accounts[1].getBalance()
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(
                                      raffleEntranceFee
                                          .mul(additionalEntrants)
                                          .add(raffleEntranceFee)
                                          .toString()
                                  )
                              )
                          } catch (e) {
                              reject(e)
                          }
                          resolve()
                      })

                      //   below, we will fire the event and listener will pick it up and resolve
                      const tx = await raffle.performUpkeep([])
                      const txReceipt = await tx.wait(1)

                      const winnerStartingBalance = await accounts[1].getBalance()

                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          // emits a WinnerPicked event and raffle.once... will find the event
                          txReceipt.events[1].args.requestId,
                          raffle.address
                      )
                  })
              })
          })
      })
