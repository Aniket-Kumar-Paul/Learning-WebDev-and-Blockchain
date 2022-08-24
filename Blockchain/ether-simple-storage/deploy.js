const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  // Ganache RPC Server -> HTTP://172.18.128.1:7545
  // connect script to the blockchain/server
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://172.18.128.1:7545"
  );

  // connect wallet(<private key>, <provider>)
  const wallet = new ethers.Wallet(
    "35a00155d4a52060257db1208c166b311f1e37062e74402b443ec6cc59a011ae",
    provider
  );

  // to deploy, we need the bin and abi files of the contract (bin,abi gets generated after compiling(yarn compile))
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet); // object to deploy
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
