require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require('path')
const { API_URL, MNEMONIC } = process.env

module.exports = {
  contracts_build_directory: path.join(__dirname, '/src/contracts'),
  networks: {
    test: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, API_URL)
      },
      network_id: '*',
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.8.5',
    },
  },
}
