const GoFundMe = artifacts.require("GoFundMe");

module.exports = async function(deployer, accounts) {
  deployer.deploy(GoFundMe);
};