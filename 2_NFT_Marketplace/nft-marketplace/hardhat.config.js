/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "jAJjRUS-vJTfDm-wl7ND-P1R4UEoGBiG"

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // url: "https://rpc-mumbai.maticvigil.com", 
      url: "https://polygon-mumbai.g.alchemy.com/v2/jAJjRUS-vJTfDm-wl7ND-P1R4UEoGBiG",
      accounts: [privateKey]
    },
    mainnet: {
      
      url: "https://polygon-mainnet.g.alchemy.com/v2/jAJjRUS-vJTfDm-wl7ND-P1R4UEoGBiG",
      accounts: [privateKey],
    }
    
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}