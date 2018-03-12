'use strict';
var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  networks: {
    ropsten: {
        host: "54.91.54.77", //network address where the container is set up.
        port: 8545,
        network_id: "3",
        gas: 4400000,
        gasPrice: 22000000000,
        from: '0xf95edde2fb013c0c861f456f601a20bcca23b70e',
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id,
      gas: 5900000,
      gasPrice: 22000000000,
    },
  },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },

};
