pragma solidity ^0.6.0;

contract GoFundMe  {
    uint public nextId = 0;
    address public admin;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => bool) public campaignExists;
    mapping(address => mapping(uint => bool)) public contributors;
    mapping(address => mapping(uint => uint)) public fundingPayments;
    mapping(uint => bool) public withdrawed;

    constructor() public {
        admin = msg.sender;
    }

    struct Campaign {
        address payable owner;
        uint date;
        string name;
        uint id;
        uint amount;
        uint targetFunding;
    }

    event campaignCreated(uint duration, string name, uint goal);
    event campaignFunded(uint id, uint amount);
    event campaignWithdrawed(uint id, uint amount);
    event campaignRefunded(uint id, uint amount);

    //Creates a GoFundMe Campaign
    function createCampaign(uint _duration, string memory name, uint targetFunding) public {
        require(campaignExists[nextId] != true, 'campaign already exists!');
        //Set the end date
        uint endDate = now + _duration;
        //Create the campaign
        campaigns[nextId] = Campaign(msg.sender,  endDate, name, nextId, 0, targetFunding);
        //Update campaign exists
        campaignExists[nextId] = true;
        //Update withdrawed
        withdrawed[nextId] = false;
        //Increment nextId
        nextId++;
        //Emit Campaign created event
        emit campaignCreated(_duration, name, targetFunding);
    }

    //Fund a GoFundMe Campaign
    function fundCampaign(uint _id) campaignDoesExist(_id) external payable {
        //Cannot fund own campaign
        require(campaigns[_id].owner != msg.sender, 'cannot fund your own campaign!');
        //Cannot fund campaign that ended
        require(now < campaigns[_id].date, 'campaign already ended!');
        //Fetch the campaign
        Campaign storage _camp = campaigns[_id];
        //Increment the amount
        _camp.amount += msg.value;
        //Track the funding payments for that address
        fundingPayments[msg.sender][_id] += msg.value;
        //Track Contributors
        contributors[msg.sender][_id] = true;
        //Emit Campaign funded event
        emit campaignFunded(_id, msg.value);
    }

    //Withdraw from owners GoFundMe Campaign after it ends
    function withdraw(uint _id) campaignDoesExist(_id) onlyCampaignEnded(_id) public {
        require(campaigns[_id].owner == msg.sender, 'you must own this campaign to withdraw!');
        require(now > campaigns[_id].date, 'campaign must have ended!');
        require(withdrawed[_id] != true, 'already withdrawed from this campaign!');
        require(campaigns[_id].amount >= campaigns[_id].targetFunding, 'campaign must have succeeded to withdraw!');
        //Fetch campaign owner
        address payable campOwner = campaigns[_id].owner;
        //Fetch amount to be sent to campaign owner
        uint campAmount = campaigns[_id].amount;
        //Transfer the Ether to the campaign owner
        campOwner.transfer(campAmount);
        //Change withdrawed to true
        withdrawed[_id] = true;
        //Emit Campaign withdrawed event
        emit campaignWithdrawed(_id, campAmount);
    }

    //Refunds the contributers if the campaign fails
    function refund(uint _id) campaignDoesExist(_id) onlyCampaignEnded(_id) public {
        //Cannot refund your own campaign
        require(campaigns[_id].owner != msg.sender, 'cannot get a refund from your own campaign!');
        //Campaign must have ended
        require(now > campaigns[_id].date, 'campaign must have ended!');
        //Must have contributed
        require(fundingPayments[msg.sender][_id] > 0, 'must contribute to refund!');
        //Campaign must have failed for a refund
        require(campaigns[_id].amount < campaigns[_id].targetFunding, 'campaign must have failed for a refund!');
        //Fetch the address requesting a refund
        address payable refunder = msg.sender;
        //Refund the refunder
        refunder.transfer(fundingPayments[msg.sender][_id]);
        //Clear the refunder contributions for that campaign
        delete fundingPayments[msg.sender][_id];
        //Emit Campaign refunded event
        emit campaignRefunded(_id, fundingPayments[msg.sender][_id]);
    }

        //Only Admin modifier
        modifier onlyAdmin() {
        require(msg.sender == admin, 'only admin');
        _;
    }

        //Campaign ended modifier
        modifier onlyCampaignEnded(uint _id) {
        require(now > campaigns[_id].date, 'campaign must have ended!');
        _;
    }
        //Campaign exists modifier
        modifier campaignDoesExist(uint _id) {
        require(campaignExists[_id] == true, 'campaign must exist!');
        _;
    }
}