module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,            // Standard Ganache port
      network_id: "*",       // Any network
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",      // Matches our ParkEase.sol version
    }
  }
};