const { assert } = require('chai')

const GoFundMe = artifacts.require("./GoFundMe.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("GoFundMe", accounts => {
  let GoFundMeInstance
  
  before(async () => {
    GoFundMeInstance = await GoFundMe.deployed();
  
  })

  it("Should deploy the contract", async () => {
    address = GoFundMeInstance.address
    assert.equal(address, GoFundMeInstance.address)
  });

  //Test minting house tokens
  it("Creates Campaigns", async () => {
    await GoFundMeInstance.createCampaign(500, 'Josh Campaign', 210, {from:accounts[0]})
    let nextId = await GoFundMeInstance.nextId()
    nextId = nextId.toNumber()
    assert.equal(7, nextId)
    let camp = await GoFundMeInstance.campaigns(7)
    assert.equal(camp.owner, accounts[0])
    assert.equal(camp.name, 'Josh Campaign')
    assert.equal(camp.date, 500)
    assert.equal(camp.targetFunding, 210)

  });

  it("Funds Campaigns", async () => {
    let _camp = await GoFundMeInstance.campaigns(4)
    await GoFundMeInstance.fundCampaign(4, {from: accounts[1], value: web3.utils.toWei('.1', 'Ether')})
    console.log('Campaign ID:', _camp.id.toNumber())
    console.log('Campaign Name:', _camp.name)
    console.log('Campaign Amount:', _camp.amount.toNumber())
    console.log('Campaign Date:', _camp.date.toNumber())
    console.log('Campaign Goal:', _camp.targetFunding.toNumber())

    let contributed = await GoFundMeInstance.contributors(accounts[1], 4)
    console.log('Contributed?:', contributed)
    assert.equal(_camp.amount.toNumber(), 500)
    assert.equal(contributed, true)

  });

  it("Withdraws from Campaign", async () => {
    

  });

  it("Refunds from Campaign", async () => {
    

});

});
