require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

const PRIVATE_KEY = process.env.PRIVATE_KEY

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.9" }, { version: "0.6.6" }]
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY], // can have a list of accounts
            chainId: 5
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // accounts - already placed by the hardhat node
            chainId: 31337 // hardhat
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY
    },
    namedAccounts: {
        // name
        deployer: {
            default: 0 // by default, 0th account is the deployer
            // 5: 1, // chainId: index (on goerli, 1st account is deployer)
        }
    }
}
