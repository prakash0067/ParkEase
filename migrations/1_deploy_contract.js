const ParkEase = artifacts.require("ParkEase");

module.exports = function (deployer) {
  // Deploy the contract with 10 parking slots
  deployer.deploy(ParkEase, 10);
};