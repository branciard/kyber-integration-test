
var SwapEth = artifacts.require("./SwapEth.sol");
var OnlyToken = artifacts.require("./OnlyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SwapEth);
  deployer.deploy(OnlyToken,"0x5b9a857e0C3F2acc5b94f6693536d3Adf5D6e6Be");
};
