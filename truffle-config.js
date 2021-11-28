const path = require('path');
module.exports = {
  contracts_build_directory: path.join(__dirname, '/src/contracts'),
  networks: {
    develop: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    loc_development_development: {
      network_id: "*",
      port: 7545,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.8.5'
    }
  }
};
