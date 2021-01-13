import React, { Component } from "react";
import GoFundMe from "./abis/GoFundMe.json";
import Web3 from 'web3'
import Main from './Main'
import Navbar from './Navbar'
import "./App.css";
import Identicon from 'identicon.js';
import smile from './src_images/smiley.jpg'
import ethPic from './src_images/ETH.png';



class App extends Component {
  
  async componentWillMount() {
    
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.updateCampaigns()
    this.getCurrentTime()
    
    
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
        this.setState({contributionsState: contribs})
        this.setState({loading: false})

        
       
        
    
      } 
        catch(e)  {
        //this.setState({loading: true})
        window.alert('Cannot update Campaigns! Error:', e)
        
      }
    
}

    getCurrentTime(){
      var _date = new Date().toISOString().split('T')[0];
      this.setState({currentDate: _date})
      console.log('Date State:', this.state.currentDate)
    }


    //Creates Campaigns
    createCampaign = (_name, _dur, _goal) => {

      const date = Math.floor(
        (new Date(_dur)).getTime() / 1000
      );
      
      
      try{
      this.state.goFundContract.methods.createCampaign(date, _name, _goal).send({ from: this.state.account }).on('transactionHash', (hash) => {
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
      //amount = window.web3.utils.fromWei(amount, 'Ether')
      this.state.goFundContract.methods.withdraw(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
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
      console.log(accounts)
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
              <form className="mb-5" 
                            onSubmit={(event) => {
                            event.preventDefault()
                            let campName, campDuration, campGoal
                            campName = this.name.value
                            campDuration = this.duration.value.toString()
                            campGoal = window.web3.utils.toWei(this.goal.value.toString(), 'Ether')
                            this.createCampaign(campName, campDuration, campGoal)
              }}>
                        
                        <div className="input-group form-row justify-content-center">
                          <div className="form-group col-md-6 ">
                            <label>Name of Campaign</label>
                            <input
                            type="text"
                            ref={(name) => { this.name = name }}
                            className="form-control form-control-lg"
                            placeholder="Campaign Name"
                            required />
                          </div>
                        </div>
                        
                        <div className="input-group form-row justify-content-center">
                          <div className="form-group col-sm-5">
                            <label className="text-center">Date</label>
                              <input
                              type="datetime-local"
                              ref={(duration) => { this.duration = duration }}
                              className="form-control form-control-lg"
                              placeholder="0"
                              required /> 
                          </div>
                          

                            <div className="form-group col-sm-2">
                            <label className="text-center">Goal (in Ether)</label>
                              <input
                              type="number"
                              step=".01"
                              ref={(goal) => { this.goal = goal }}
                              className="form-control form-control-lg"
                              placeholder="0 ETH"
                              required /> 
                            </div>
                          </div>
                        
                        <button type="submit" className="btn btn-success  btn-lg">
                          Create Campaign
                        </button>
              </form>
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
                isFinished={this.isFinished}
                withdrawed={this.state.withdrawed}
          />

      </div>
    );
  }
}

export default App;
