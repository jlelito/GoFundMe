import React, { Component } from 'react';
import Card from './Card.js';
import magnify from './src_images/magnify.png';

class Main extends Component {

  async componentWillMount() {
    
    let ownedCampaigns = []
    this.props.campItems.forEach(element => {
      if (element.owner == this.props.account){
        ownedCampaigns.push(element)
      }
    });
    this.setState({myCampaigns: ownedCampaigns})
  }

  constructor(props) {
    super(props)
    this.state = {
      myCampaigns: [],
      filteredCampaigns: this.props.campItems
    }
  }

  render() {

    return (
      <div className="resume-section ">
        {this.state.myCampaigns.length == 0 ? null : 
        <>
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
          </>
  }
          
        <b><h1 className="h1 mb-5 mt-5">Active Campaigns</h1></b>
        <form className="mb-3 form-inline" onSubmit={(event) => {
                            event.preventDefault()
                            let searchInput
                            searchInput = this.searchInput.value.toString()
                            let newFilteredCampaigns = this.props.campItems.filter(campaign => 
                              campaign.name.toLowerCase().includes(searchInput.toLowerCase())
                            )
                          
                            this.setState({filteredCampaigns: newFilteredCampaigns})                
        }}>
        <div className="container">
          <div className="form-row justify-content-center mb-1">
            <div className="col-auto">
            
              <label>Search</label> 
              <div className="input-group">
                <img src={magnify} className="float-right mt-1" width='35' height='35'/>
                <input class="form-control form-control" type="text" placeholder="Search..." ref={(searchInput) => { this.searchInput = searchInput }}
                  aria-label="Search">
                </input>
              </div>
            </div>
            
                  <div className="col-auto">
                    <button type="submit" className="btn btn-primary mt-4" >
                      Search
                    </button>
                  </div>
                </div>
              </div>
          </form>
          <main role="main" className="container-fluid d-flex justify-content-center">
          
            <div className="card-group justify-content-center">
              
            {this.state.filteredCampaigns.map(campaign => (
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
          <b><h1 className="h1 mb-5 mt-5">Finished Campaigns</h1></b>
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
                          refund={this.props.refund}
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