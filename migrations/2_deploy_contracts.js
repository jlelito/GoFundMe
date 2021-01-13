const GoFundMe = artifacts.require("GoFundMe");

module.exports = async function(deployer, accounts) {
  deployer.deploy(GoFundMe);
  const contract = await GoFundMe.deployed();
  //await contract.createCampaign(1000, 'First Campaign', 5000000, {from: accounts[1]});
};