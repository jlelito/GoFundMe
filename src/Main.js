import React, { Component } from 'react';
import Card from './Card.js';

class Main extends Component {

  render() {

    return (
      <div className="resume-section ">
        <b><h1 className="h1 mb-5 mt-5">Your Campaigns!</h1></b>
          <main role="main" className="container-fluid d-flex justify-content-center">
          
            <div className="card-group justify-content-center">

            {this.props.campItems.map(campaign => (
              <>
                    {campaign.owner == this.props.account ? (
                    <div className="row">
                      <Card
                        campaign = {campaign}
                        fundCampaign={this.props.fundCampaign}
                        account={this.props.account}
                        withdraw={this.props.withdraw}
                        isFinished={this.props.isFinished}
                        withdrawed={this.props.withdrawed}
                      />
                    
                  </div> 
                    ) : null}
              </>
              ))}
            </div>
          </main>
          <hr />
        <b><h1 className="h1 mb-5 mt-5">Active Campaigns!</h1></b>
          <main role="main" className="container-fluid d-flex justify-content-center">
          
            <div className="card-group justify-content-center">
              
            {this.props.campItems.map(campaign => (
              <>
                    <p>{this.props.isFinished(campaign) == false ? (
                    <div className="row">
                      <Card
                        campaign = {campaign}
                        fundCampaign={this.props.fundCampaign}
                        account={this.props.account}
                        withdraw={this.props.withdraw}
                        isFinished={this.props.isFinished}
                        withdrawed={this.props.withdrawed}
                      />
                    
                  </div> 
                    ) : null}
                    </p>
              </>
            ))}

            </div>
          </main>
          <hr />
          <b><h1 className="h1 mb-5 mt-5">Finished Campaigns!</h1></b>
          <main role="main" className="container-fluid d-flex justify-content-center">
            <div className="card-group justify-content-center">
              
            {this.props.campItems.map(campaign => (
              <>
                  <p>{this.props.isFinished(campaign) == true ? (
                    <div className="row">
                        <Card
                          campaign = {campaign}
                          fundCampaign={this.props.fundCampaign}
                          account={this.props.account}
                          withdraw={this.props.withdraw}
                          isFinished={this.props.isFinished}
                          withdrawed={this.props.withdrawed}
                        />
                    </div> 
                      ) : null}
                  </p>
              </>
                ))}
            </div>
          </main>
      </div>
    );
  }
}

export default Main;