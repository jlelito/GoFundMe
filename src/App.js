import React, { Component } from "react";
import GoFundMe from "./abis/GoFundMe.json";
import Web3 from 'web3'
import Main from './Main'
import Navbar from './Navbar'
import "./App.css";
import Identicon from 'identicon.js';
import smile from './src_images/smiley.jpg'
import ethPic from './src_images/ETH.png';
import CreateCampaignForm from './CreateCampaign.js';



class App extends Component {
  
  async componentWillMount() {
    
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.updateCampaigns()
  
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

    

    //Update the Campaign Ids and Owner List
  async updateCampaigns() {
    
    try {
        console.log('Loading Campaigns..', this.state.goFundContract)
        let length = await this.state.goFundContract.methods.nextId().call()
        console.log('Length:', length)
        const camps = []
        let contribs = []
        let withdrawed = []
        for(let i=0; i<length; i++){
          let currentCampaign = await this.state.goFundContract.methods.campaigns(i).call()
          camps.push(currentCampaign)
          let currentWithdrawed = await this.state.goFundContract.methods.withdrawed(i).call()
          withdrawed.push(currentWithdrawed)
          let currentContrib = await this.state.goFundContract.methods.fundingPayments(this.state.account, i).call()
          if(currentContrib > 0){
            contribs.push([i,currentContrib])
          }

        }
        console.log('Contributions', contribs)
        this.setState({campaignList: camps})
        this.setState({withdrawed})
        console.log('Campaign List:', this.state.campaignList)
        console.log('Contributions:', contribs)
        this.setState({contributionsState: contribs})
        this.setState({loading: false})

        
       
        
    
      } 
        catch(e)  {
        //this.setState({loading: true})
        window.alert('Cannot update Campaigns! Error:', e)
        
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
      console.log('Seconds Difference:', seconds)
      console.log('Now Date:', nowDate)
      console.log('Target Date: ', targetDate)
      
      try{
      this.state.goFundContract.methods.createCampaign(seconds, _name, _goal).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        console.log(hash)
        window.location.reload();
      })
      } catch(e) {
        window.alert(e)
      }
    }


    //Fund the targeted campaign
     fundCampaign = (campId, amount) => {
      try{
      amount = window.web3.utils.toWei(amount, 'Ether')
      this.state.goFundContract.methods.fundCampaign(campId).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
    } catch(e){
      window.alert(e)
    }
    }

    withdraw = (campId) => {
      try{
      this.state.goFundContract.methods.withdraw(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
    } catch(e){
      window.alert(e)
    }
    }

    refund = (campId) => {
      try{
      this.state.goFundContract.methods.refund(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
        //Check if Transaction failed or not
        window.location.reload();
      })
    } catch(e){
      window.alert(e)
    }
    }

    isFinished = (event)  => {
      const now = new Date().getTime();
      const eventEnd =  (new Date(parseInt(event.date) * 1000)).getTime();
      return (eventEnd > now) ? false : true;
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
        <div className="text-center">
          <h1 className="text-center mt-5">Loading the Blockchain! Please Wait!</h1> 
          <img className="center-block" src={smile}></img>
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
      <div className="App">
        <Navbar 
          account={this.state.account}
        />
        &nbsp;
        <h1 className="my-5">GoFundMe!</h1>
        <hr />
        <div className="row">
            <div className='col-6'>
              <h2 className="my-4">Create Campaign!</h2>
              <CreateCampaignForm 
                createCampaign={this.createCampaign}
              />
            </div>
          
          <div className="col-md-5 justify-content-center">
          <h2 className="my-4">Your Contributions</h2>
            <table className="table table-striped table-hover mt-5 mr-2">
              <caption>Contributions</caption>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Campaign Name</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
              <tbody>
                
                {this.state.contributionsState.map(contrib => (
                  <tr key={contrib.id}>
                    <td>{contrib[0]}</td>
                    <td>{this.state.campaignList[contrib[0]].name}</td>
                    <td>{window.web3.utils.fromWei(contrib[1], 'Ether')} ETH<img src={ethPic} width='25' height='25'/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>   
        <hr />
        
          <Main
                campItems={this.state.campaignList}
                account={this.state.account}
                fundCampaign={this.fundCampaign}
                withdraw={this.withdraw}
                refund={this.refund}
                isFinished={this.isFinished}
                withdrawed={this.state.withdrawed}
          />

      </div>
    );
  }
}

export default App;
