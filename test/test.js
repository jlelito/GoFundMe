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
    await GoFundMeInstance.createCampaign(5000000000, 'Josh Campaign', 210, {from:accounts[0]})
    let nextId = await GoFundMeInstance.nextId()
    nextId = nextId.toNumber()
    assert.equal(1, nextId)
    let camp = await GoFundMeInstance.campaigns(0)
    assert.equal(camp.owner, accounts[0])
    assert.equal(camp.name, 'Josh Campaign')
    assert.equal(camp.date, 5000000000)
    assert.equal(camp.targetFunding, 210)

  });

  it("Funds Campaigns", async () => {
    let _camp = await GoFundMeInstance.campaigns(0)
    await GoFundMeInstance.fundCampaign(0, {from: accounts[1], value: web3.utils.toWei('.1', 'Ether')})
    console.log('Campaign ID:', _camp.id.toNumber())
    console.log('Campaign Name:', _camp.name)
    console.log('Campaign Amount:', _camp.amount.toNumber())
    console.log('Campaign Date:', _camp.date.toNumber())
    console.log('Campaign Goal:', _camp.targetFunding.toNumber())

    let contributed = await GoFundMeInstance.contributors(accounts[1], 0)
    let _campNew = await GoFundMeInstance.campaigns(0)
    let newAmount = await _campNew.amount.toString()
    console.log('Contributed?:', contributed)
    console.log('New Amount:', newAmount)
    assert.equal(newAmount, '100000000000000000')
    assert.equal(contributed, true)

  });

  it("Withdraws from Campaign", async () => {
    

  });

  it("Refunds from Campaign", async () => {
    await GoFundMeInstance.createCampaign(10000000000, 'Other Campaign', 10, {from:accounts[0]})
    let beforeRefund = await GoFundMeInstance.campaigns(1)
    console.log('Refund Campaign Name:', beforeRefund.name)
    await GoFundMeInstance.fundCampaign(1, {from: accounts[1], value: web3.utils.toWei('.1', 'Ether')})
    let contributionAmount = await GoFundMeInstance.fundingPayments(accounts[2], 1)
    console.log('Contibution Amount', contributionAmount.toString())
    beforeRefund = await GoFundMeInstance.campaigns(1)
    console.log('New Amount', beforeRefund.amount.toString())
    console.log('Waiting for the campaign to end')
    //Wait for X number of seconds
    await new Promise(resolve => setTimeout(resolve, 10000))
    await GoFundMeInstance.refund(1, {from: accounts[1]})
});

});
