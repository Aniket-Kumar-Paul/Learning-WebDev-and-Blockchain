const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// yarn hardhat coverage --> to check which functions/parts are not yet included in the test

!developmentChains.includes(network.name)
    ? describe.skip // skip the test if network is not a development chain
    : describe("FundMe", async function() {
          let fundMe, deployer, mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") // 1ETH

          beforeEach(async function() {
              // Deploy Fundme Contract using Hardhat-deploy

              // const { deployer } = await getNamedAccounts()
              deployer = (await getNamedAccounts()).deployer
              // another way to get deployer account
              // const accounts = await ethers.getSigners()
              // const accountZero = accounts[0]

              await deployments.fixture(["all"]) // allows us to run all the files in deploy folder using tags
              fundMe = await ethers.getContract("FundMe", deployer) // get the most recent deployment of the contract
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function() {
              it("sets the aggregator addresses correctly", async function() {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function() {
              it("Fails if you don't send enough ETH", async function() {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  ) // if the expect fails, revert with error message but pass the test
              })

              // to run just one test like below one
              // yarn hardhat test --grep "amount funded"
              it("Updated the amount funded data structure", async function() {
                  await fundMe.fund({ value: sendValue }) // send ether to the contract of given value
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  ) // get the amount funded using the deployer address
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Adds funder to array of getFunder", async function() {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function() {
              // we need funds before withdrawing, so first fund the contract
              beforeEach(async function() {
                  await fundMe.fund({ value: sendValue })
              })

              it("Withdraw ETH from a single funder", async function() {
                  // Arrange
                  const initialFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const initialDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Check if there is any gas used and gas price field in transactionReceipt
                  // using breakpoint after transaction receipt and seeing its content in debug console
                  // Calculate total gas cost
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice) // multiply

                  const currentFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const currentDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Assert
                  assert.equal(currentFundMeBalance, 0)
                  assert.equal(
                      initialFundMeBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      currentDeployerBalance.add(gasCost).toString()
                  ) // we are using .add instead of + since its a big number
              })

              it("cheaperWithdraw ETH from a single funder", async function() {
                  // Arrange
                  const initialFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const initialDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Check if there is any gas used and gas price field in transactionReceipt
                  // using breakpoint after transaction receipt and seeing its content in debug console
                  // Calculate total gas cost
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice) // multiply

                  const currentFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const currentDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Assert
                  assert.equal(currentFundMeBalance, 0)
                  assert.equal(
                      initialFundMeBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      currentDeployerBalance.add(gasCost).toString()
                  ) // we are using .add instead of + since its a big number
              })

              it("Allows us to withdraw with multiple getFunder", async function() {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  // starting from 1 since 0 is the deployer
                  for (let i = 1; i < 6; i++) {
                      // By default, fundMe is connected to deployer
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const initialFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const initialDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice) // multiply

                  const currentFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const currentDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Assert
                  assert.equal(currentFundMeBalance, 0)
                  assert.equal(
                      initialFundMeBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      currentDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that getFunder are reset properly
                  // test if the transaction was reverted
                  await expect(fundMe.getFunder(0)).to.be.reverted // if all getFunder have been reset, then fundMe.getFunder(0) should give error, which will be reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("Only allows the owner to withdraw", async function() {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1] // some random attacker trying to withdraw
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )

                  // transaction should revert with the custom error if attacker tries to withdraw
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner") // (contract name, custom error)
              })

              it("cheaperWithdraw testing..", async function() {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  // starting from 1 since 0 is the deployer
                  for (let i = 1; i < 6; i++) {
                      // By default, fundMe is connected to deployer
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const initialFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const initialDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice) // multiply

                  const currentFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const currentDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Assert
                  assert.equal(currentFundMeBalance, 0)
                  assert.equal(
                      initialFundMeBalance
                          .add(initialDeployerBalance)
                          .toString(),
                      currentDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that getFunder are reset properly
                  // test if the transaction was reverted
                  await expect(fundMe.getFunder(0)).to.be.reverted // if all getFunder have been reset, then fundMe.getFunder(0) should give error, which will be reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })
