import React, { Component } from 'react';
import GoFundMe from './abis/GoFundMe.json';
import Web3 from 'web3'
import Main from './Main'
import Navbar from './Navbar'
import './App.css';
import smile from './src_images/smiley.jpg'
import ethPic from './src_images/ETH.png';
import money from './src_images/Donate.png'
import CreateCampaignForm from './CreateCampaign.js';

class App extends Component {
  
  async componentWillMount() {
    this.setState({loading: true})
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.updateCampaigns()
    this.setState({loading: false})
  }

  //Loads Web3 to detect MetaMask
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  //Loads all the blockchain data
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    
    // Load GoFundMe
    const goFundData = GoFundMe.networks[networkId]
    if(goFundData) {
      const abi = GoFundMe.abi
      const address = goFundData.address
      //Load contract and set state
      const tokenContract = new web3.eth.Contract(abi, address)
      this.setState({ goFundContract : tokenContract })
      
      //Get contract data
      let contractAdmin = await this.state.goFundContract.methods.admin().call()
      this.setState({admin: contractAdmin})
       
    } else {
          this.setState({loading:true})
          window.alert('GoFundMe contract not deployed to detected network. Please connect to network 7545')
    }
      
  }
  
    //Update the Campaign Ids and Owner List
  async updateCampaigns() {
    
    try {
        let length = await this.state.goFundContract.methods.nextId().call()
        let camps = []
        let contribs = []
        let withdrawed = []
        for(let i=0; i<length; i++){
          let currentContrib = await this.state.goFundContract.methods.fundingPayments(this.state.account, i).call()
          contribs.push([i,currentContrib])
          let currentCampaign = await this.state.goFundContract.methods.campaigns(i).call()
          camps.push(currentCampaign)
          let currentWithdrawed = await this.state.goFundContract.methods.withdrawed(i).call()
          withdrawed.push(currentWithdrawed)
          
        }
        this.setState({contributionsState: contribs})
        this.setState({campaignList: camps})
        this.setState({withdrawed})
        
      }
        catch(e)  {
        window.alert('Cannot update Campaigns! Error:', e.toString())
        
      }
    
}

    
    //Creates Campaigns
    createCampaign = (_name, _dur, _goal) => {
      var now = new Date()
      var isoDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
      //Calculate the number of seconds until the end date
      const nowDate = Math.floor(
        (new Date(isoDateTime)).getTime() / 1000
      )

      const targetDate = Math.floor(
        (new Date(_dur)).getTime() / 1000
      )

      let seconds = (targetDate - nowDate)

      try {
      this.state.goFundContract.methods.createCampaign(seconds, _name, _goal).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
      } catch(e) {
        window.alert(e)
      }
    }

    //Fund the targeted campaign
     fundCampaign = (campId, amount) => {
      try {
      amount = window.web3.utils.toWei(amount, 'Ether')
      this.state.goFundContract.methods.fundCampaign(campId).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
    } catch(e) {
      window.alert(e)
    }
    }

    withdraw = (campId) => {
      try {
      this.state.goFundContract.methods.withdraw(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
    } catch(e) {
      window.alert(e)
    }
    }

    refund = (campId) => {
      try {
      this.state.goFundContract.methods.refund(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
      } catch(e) {
        window.alert(e)
      }
    }

    isFinished = (campaign)  => {
      const now = new Date().getTime();
      const campaignEnd =  (new Date(parseInt(campaign.date) * 1000)).getTime();
      return (campaignEnd > now) ? false : true;
    }

    async didContribute (campId) {

      return false
    }

    constructor(props) {
      super(props)
      this.state = {
        account: '0x0',
        admin:'0x0',
        goFundContract: {},
        campaignList: [],
        contributors:{},
        contributionsState:[],
        withdrawed:{},
        loading: true,
        currentDate:null
      }
    }
    
  render() {
    if(this.state.loading) {

      return (
        <div className='text-center'>
          <h1 className='text-center mt-5'>Loading the Blockchain! Please Wait!</h1> 
          <img className='center-block' src={smile} alt='smiley'></img>
        </div>
      )

    }

    

    window.ethereum.on('accountsChanged', accounts => {
      this.setState({account: accounts[0]})
      window.location.reload();
    });

    window.ethereum.on('networkChanged', networkId => {
      window.location.reload();
    })

    return (
      <div className='App'>
        <Navbar 
          account={this.state.account}
        />
        &nbsp;
        <h1 className='my-5'>Fundraising</h1>
        <hr />
        <div className='row'>
            <div className='col-6'>
              <h2 className='my-4'>Create Campaign</h2>
              <CreateCampaignForm 
                createCampaign={this.createCampaign}
              />
            </div>
          
          <div className='col-md-5 justify-content-center'>
          <h2 className='my-4'>Your Contributions <img src={money} width='35' height='35' alt='eth logo'/> </h2> 
            <table className='table table-striped table-hover mt-5 mr-2'>
              <caption>Contributions</caption>
                <thead className='thead-light'>
                  <tr>
                    <th>ID</th>
                    <th>Campaign Name</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
              <tbody>
                
                {this.state.contributionsState.map(contrib => (
                  <>
                  {contrib[1] > 0 ? 
                  <tr key={contrib.id}>
                    <td>{contrib[0]}</td>
                    <td>{this.state.campaignList[contrib[0]].name}</td>
                    <td>{window.web3.utils.fromWei(contrib[1], 'Ether')} ETH<img src={ethPic} width='25' height='25' alt='eth logo'/></td>
                  </tr> 
                  : null 
                }
                </>
                ))}
              </tbody>
            </table>
          </div>
        </div>   
        <hr />
        
          <Main
                contributionsState={this.state.contributionsState}
                campItems={this.state.campaignList}
                account={this.state.account}
                withdrawed={this.state.withdrawed}
                fundCampaign={this.fundCampaign}
                withdraw={this.withdraw}
                refund={this.refund}
                isFinished={this.isFinished}
                didContribute={this.didContribute}  
          />

      </div>
    );
  }
}

export default App;
