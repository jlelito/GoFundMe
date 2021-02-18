import React, { Component } from 'react';
import GoFundMe from './abis/GoFundMe.json';
import Web3 from 'web3';
import Navbar from './components/Navbar';
import './App.css';
import ethPic from './src_images/ETH.png';
import money from './src_images/Donate.png';
import CreateCampaignForm from './components/CreateCampaign.js';
import Notification from './components/Notification.js';
import ConnectionBanner from '@rimble/connection-banner';
import Loading from './components/Loading.js';
import Campaigns from './components/ActiveCampaigns.js';

class App extends Component {
  
  async componentDidMount() {
    await this.loadBlockchainData()
  }

  //Loads all the blockchain data
  async loadBlockchainData() {
    let web3
    
    this.setState({loading: true})
    if(typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum)
      await this.setState({web3})
      await this.loadAccountData()
    } else {
      let infuraURL = `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
      web3 = new Web3(new Web3.providers.HttpProvider(infuraURL))
      await this.setState({web3})
    }
    await this.loadContractData()
    await this.updateCampaigns()
    this.setState({loading: false})
      
  }

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts()
    if(typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
      let currentEthBalance = await this.state.web3.eth.getBalance(accounts[0])
      currentEthBalance = this.state.web3.utils.fromWei(currentEthBalance, 'Ether')
      await this.setState({account: accounts[0], currentEthBalance, isConnected: true})
    } else {
      await this.setState({account: null, isConnected: false})
    }

    const networkId = await this.state.web3.eth.net.getId()
    this.setState({network: networkId})

    if(this.state.network !== 3) {
      let web3
      this.setState({wrongNetwork: true})
      let infuraURL = `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
      web3 = new Web3(new Web3.providers.HttpProvider(infuraURL))
      await this.setState({web3})
    }
  }

  async loadContractData() {
    let contractAdmin
    let goFundData = GoFundMe.networks[3]
    if(goFundData) {
      const abi = GoFundMe.abi
      const address = goFundData.address

      //Load contract and set state
      const tokenContract = new this.state.web3.eth.Contract(abi, address)
      await this.setState({ goFundContract : tokenContract, contractAddress: address })
      //Get Admin and set to state.
      contractAdmin = await this.state.goFundContract.methods.admin().call()
      this.setState({ admin: contractAdmin })
    }

  }
  
  //Update the Campaign Ids and Owner List
  async updateCampaigns() {
    try {
          let length = await this.state.goFundContract.methods.nextId().call()
          let camps = []
          let contribs = []
          let withdrawed = []

          for(let i=0; i<length; i++) {
            if(this.state.account !== null && this.state.account !== undefined) {
              let currentContrib = await this.state.goFundContract.methods.fundingPayments(this.state.account, i).call()
              contribs.push([i,currentContrib])
            }
            let currentCampaign = await this.state.goFundContract.methods.campaigns(i).call()
            camps.push(currentCampaign)
            let currentWithdrawed = await this.state.goFundContract.methods.withdrawed(i).call()
            withdrawed.push(currentWithdrawed)
          }
          
          await this.setState({contributionsState: contribs, campaignList: camps, withdrawed})
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
    this.state.goFundContract.methods.createCampaign(seconds, _name, _goal).send({ from: this.state.account }).on('transactionHash', async (hash) => {
      this.setState({hash, action: 'Created Campaign', trxStatus: 'Pending'})
      this.showNotification()
      this.state.goFundContract.events.campaignCreated({}, async (error, event) => {
        
        await this.updateCampaigns()

    })
      }).on('receipt', async (receipt) => {
        if(receipt.status === true){
          this.setState({trxStatus: 'Success'})
        }
        else if(receipt.status === false){
          this.setState({trxStatus: 'Failed'})
        }
      }).on('error', (error) => {
          window.alert('Error! Could not create campaign! Please change network to Ropsten')
      }).on('confirmation', (confirmNum) => {
          if(confirmNum > 10) {
            this.setState({confirmNum : '10+'})
          } else{
          this.setState({confirmNum})
          }
      })
    } catch(e) {
      window.alert(e)
    }
  }

  //Fund the targeted campaign
  fundCampaign = (campId, amount) => {
    try {
    amount = this.state.web3.utils.toWei(amount, 'Ether')
    this.state.goFundContract.methods.fundCampaign(campId).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
      this.setState({hash, action: 'Contributed to Campaign', trxStatus: 'Pending'})
      this.showNotification()
      this.state.goFundContract.events.campaignFunded({}, async (error, event) => {
        
        await this.updateCampaigns()
    })
      }).on('receipt', async (receipt) => {
        if(receipt.status === true){
          this.setState({trxStatus: 'Success'})
        }
        else if(receipt.status === false){
          this.setState({trxStatus: 'Failed'})
        }
      }).on('error', (error) => {
          window.alert('Error! Could not fund campaign! Please change network to Ropsten')
      }).on('confirmation', (confirmNum) => {
          if(confirmNum > 10) {
            this.setState({confirmNum : '10+'})
          } else{
          this.setState({confirmNum})
          }
      })
    } catch(e) {
      window.alert(e)
    }
  }

  withdraw = (campId) => {
    try {
    this.state.goFundContract.methods.withdraw(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({hash, action: 'Withdrawed', trxStatus: 'Pending'})
      this.showNotification()
      this.state.goFundContract.events.campaignWithdrawed({}, async (error, event) => {
        await this.updateCampaigns()
    })
      }).on('receipt', async (receipt) => {
        if(receipt.status === true){
          this.setState({trxStatus: 'Success'})
        }
        else if(receipt.status === false){
          this.setState({trxStatus: 'Failed'})
        }
      }).on('error', (error) => {
          window.alert('Error! Could not withdraw from campaign! Please change network to Ropsten')
      }).on('confirmation', (confirmNum) => {
          if(confirmNum > 10) {
            this.setState({confirmNum : '10+'})
          } else{
          this.setState({confirmNum})
          }
      })
    } catch(e) {
      window.alert(e)
    }
  }

  refund = (campId) => {
    try {
    this.state.goFundContract.methods.refund(campId).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({hash, action: 'Refunded Contribution', trxStatus: 'Pending'})
      this.showNotification()
      this.state.goFundContract.events.campaignRefunded({}, async (error, event) => {
        await this.updateCampaigns()
    })
      }).on('receipt', async (receipt) => {
        if(receipt.status === true){
          this.setState({trxStatus: 'Success'})
        }
        else if(receipt.status === false){
          this.setState({trxStatus: 'Failed'})
        }
      }).on('error', (error) => {
          window.alert('Error! Could not refund from campaign! Please change network to Ropsten')
      }).on('confirmation', (confirmNum) => {
          if(confirmNum > 10) {
            this.setState({confirmNum : '10+'})
          } else{
          this.setState({confirmNum})
          }
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

  showNotification = () => {
    this.notificationOne.current.updateShowNotify()
  }

    constructor(props) {
      super(props)
      this.notificationOne = React.createRef()
      this.state = {
        web3: null,
        isConnected: null,
        account: null,
        admin: null,
        goFundContract: {},
        contractAddress: null,
        campaignList: [],
        contributors: {},
        contributionsState: [],
        withdrawed: {},
        loading: true,
        currentDate: null,
        currentEthBalance: '0',
        hash: null,
        showNotification: false,
        action: null,
        trxStatus: null,
        confirmNum: 0
      }
    }
    
  render() {

    if(window.ethereum != null) {

      window.ethereum.on('chainChanged', async (chainId) => {
        window.location.reload()
      })
  
      window.ethereum.on('accountsChanged', async (accounts) => {
        if(typeof accounts[0] !== 'undefined' & accounts[0] !== null) {
          await this.loadAccountData()
          await this.updateCampaigns()
        } else {
          this.setState({account: null, currentEthBalance: 0, isConnected: false})
        }
      })
  
    }

    return (
      <div className='App'>
        <Navbar 
          account={this.state.account}
          balance={this.state.currentEthBalance}
          action={this.state.action}
          network={this.state.network}
          isConnected={this.state.isConnected}
        />

        <div className='mt-5' />
        {window.ethereum === null || window.ethereum === undefined ?
          <ConnectionBanner className='mt-5' currentNetwork={this.state.network} requiredNetwork={3} onWeb3Fallback={true} />
          :
          this.state.wrongNetwork ? <ConnectionBanner className='mt-5' currentNetwork={this.state.network} requiredNetwork={3} onWeb3Fallback={false} /> 
          :
          null
        }

        {this.state.loading ? <Loading />
        :
        <>
          &nbsp;
          <h1 className='my-2'>Fundraising</h1>
          <Notification 
              showNotification={this.state.showNotification}
              action={this.state.action}
              hash={this.state.hash}
              ref={this.notificationOne}
              trxStatus={this.state.trxStatus}
              confirmNum={this.state.confirmNum}
          />
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h2 className='my-4'>Create Campaign</h2>
              <CreateCampaignForm 
                createCampaign={this.createCampaign}
                web3={this.state.web3}
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
                    <React.Fragment key={contrib.id}> 
                      {contrib[1] > 0 ? 
                        <tr key={contrib.id}>
                          <td>{contrib[0]}</td>
                          <td>{this.state.campaignList[contrib[0]].name}</td>
                          <td>{this.state.web3.utils.fromWei(contrib[1], 'Ether')} ETH<img src={ethPic} width='25' height='25' alt='eth logo'/></td>
                        </tr> 
                        : null 
                      }
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>   
          <hr />

          <Campaigns
            web3={this.state.web3}
            campaigns={this.state.campaignList}
            contributionsState={this.state.contributionsState}
            fundCampaign={this.fundCampaign}
            account={this.state.account}
            withdraw={this.withdraw}
            isFinished={this.isFinished}
            withdrawed={this.state.withdrawed}
          />

          <div className='row justify-content-left'>
            <span className='ml-5'>Contract on Etherscan.io: </span> <a href={`https://ropsten.etherscan.io/address/${this.state.contractAddress}`} className='ml-1' target='_blank' rel='noopener noreferrer'>Contract</a>
          </div>
        </>
        }
      </div>
    );
    
  }
}

export default App;
