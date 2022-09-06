require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage") // yarn hardhat coverage -> to run, result saved in coverage.json

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY], // can have a list of accounts
            chainId: 5,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // accounts - already placed by the hardhat node
            chainId: 31337, // hardhat
        },
    },
    solidity: "0.8.16",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY, // to get the USD prices
        // ETH(default), BNB(binance), MATIC(polygon), AVAX(avalanche), HT(heco), MOVR(moonriver)
        // token: "MATIC", // deploy to polygon
    },
}
