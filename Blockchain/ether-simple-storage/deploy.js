const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // Ganache RPC Server -> HTTP://172.18.128.1:7545
    // connect script to the blockchain/server
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    // connect wallet(<private key>, <provider>)
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)

    // to deploy, we need the bin and abi files of the contract (bin,abi gets generated after compiling(yarn compile))
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet) // object to deploy
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()

    const currentFavNumber = await contract.retrieve() // retrieve is a view function in SimpleStorage => it won't cost any gas when calling here(outside contract)
    console.log(`Current Favourite Number: ${currentFavNumber.toString()}`) // by default, currentFavNumber will be of type BigNumber

    // It is a good practice to send arguments to contract functions as strings even if it is int or anything else
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)

    const updatedFavNumber = await contract.retrieve()
    console.log(`Updated Favourite Number: ${updatedFavNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
