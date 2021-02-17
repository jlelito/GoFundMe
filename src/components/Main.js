import React, { Component } from 'react';
import Card from './Card.js';
import OwnedCampaigns from './OwnedCampaigns.js';
import ActiveCampaigns from './ActiveCampaigns.js';

class Main extends Component {

  async componentDidMount() {
    await this.setMyCampaigns()
  }

  async setMyCampaigns () {
    let ownedCampaigns = []
    this.props.campItems.forEach(element => {
      if (element.owner === this.props.account){
        ownedCampaigns.push(element)
      }
    })
    await this.setState({myCampaigns: ownedCampaigns})
  }


  constructor(props) {
    super(props)
    
    this.state = {
      myCampaigns: [],
      filteredCampaigns: this.props.campItems,
      open: false
    }
  }

  render() {

    return (
      
      <div>
        {this.state.myCampaigns.length === 0 ? null : 
        <>
        <div className='row justify-content-center'>
          <b><h1 className='h1 mb-5 mt-5' id='owned-camps-title'>Your Campaigns</h1></b>  
        </div>
            <OwnedCampaigns
              web3={this.props.web3}
              campaigns={this.state.myCampaigns}
              {...this.props.contributionsState.length > 1 ?
              <>
                contributionsState={this.props.contributionsState}
              </>
              : null}
              fundCampaign={this.props.fundCampaign}
              account={this.props.account}
              withdraw={this.props.withdraw}
              isFinished={this.props.isFinished}
              withdrawed={this.props.withdrawed}
            
            />
          <hr />
          </>
        }
        
        <b><h1 className='h1 mb-5 mt-5'>Active Campaigns</h1></b>
        
          <ActiveCampaigns
            web3={this.props.web3}
            campaigns={this.state.filteredCampaigns}
            contributionsState={this.props.contributionsState}
            fundCampaign={this.props.fundCampaign}
            account={this.props.account}
            withdraw={this.props.withdraw}
            isFinished={this.props.isFinished}
            withdrawed={this.props.withdrawed}
          />
          <hr />

          <b><h1 className='h1 mb-5 mt-5'>Inactive Campaigns</h1></b>
          <main role='main' className='container-fluid d-flex justify-content-center'>
            <div className='card-group justify-content-center'>
            {this.props.campItems.map(campaign => (
              <React.Fragment key={campaign.id}> 
                  <div key={campaign.id}>{this.props.isFinished(campaign) === true ? (
                    <div className='row'>
                        <Card
                          web3={this.props.web3}
                          contribution={this.props.contributionsState[campaign.id][1]}
                          campaign = {campaign}
                          fundCampaign={this.props.fundCampaign}
                          account={this.props.account}
                          withdraw={this.props.withdraw}
                          refund={this.props.refund}
                          isFinished={this.props.isFinished}
                          didContribute={this.props.didContribute}
                          withdrawed={this.props.withdrawed}
                        />
                    </div> 
                      ) : null}
                  </div>
              </React.Fragment>
              ))}
            </div>
          </main>
      </div>
    );
  }
}

export default Main;