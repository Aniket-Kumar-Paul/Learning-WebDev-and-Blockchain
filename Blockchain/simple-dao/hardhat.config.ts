import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/types";

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // for tests
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      // for local hardhat node
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
