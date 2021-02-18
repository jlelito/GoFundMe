import React, { Component } from 'react';
import PageNav from './PageNav.js';
import Card from './Card.js';
import magnify from '../src_images/magnify.png';

class OwnedCampaigns extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            postsPerPage: 3,
            currentCampaigns: []
        }
        this.paginate = this.paginate.bind(this)
    }

    async componentDidMount() {
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.campaigns.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentCampaigns: currentPosts})
    }

    //Change Page
    async paginate (pageNumber) {
        await this.setState({currentPage: pageNumber})
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.state.currentCampaigns.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentCampaigns: currentPosts})
    }

    async filterCampaigns(search, ActiveCamps, InactiveCamps, OwnedCamps) {
        let newFilteredCampaigns = this.props.campaigns.filter(campaign => 
            campaign.name.toLowerCase().includes(search.toLowerCase())
        )

        if (!ActiveCamps && !InactiveCamps && !OwnedCamps) {
            newFilteredCampaigns = []
        }

        if (ActiveCamps && !InactiveCamps) {
            newFilteredCampaigns =  newFilteredCampaigns.filter(campaign => this.props.isFinished(campaign) === false)
        }  
        
        if (!ActiveCamps && InactiveCamps) {
            newFilteredCampaigns = newFilteredCampaigns.filter(campaign => this.props.isFinished(campaign) === true)
        } 

        if (OwnedCamps) {
            newFilteredCampaigns =  newFilteredCampaigns.filter(campaign => campaign.owner === this.props.account)
        }

        await this.setState({currentCampaigns: newFilteredCampaigns})
        await this.paginate(1) 
    }

    sortCampaigns (choice) {
        //Sort Contributed Descending 
        if(choice === 'amountContributed') {
          let sortedList = this.state.currentCampaigns.sort(function(a,b){
            return b.amount - a.amount
          })
          this.setState({currentCampaigns: sortedList})
        }
        //Sort Goal Descending
        else if(choice === 'goal') {
          let sortedList = this.state.currentCampaigns.sort(function(a,b){
            return b.targetFunding - a.targetFunding
          })
          this.setState({currentCampaigns: sortedList})
        }
        //Sort End Date New to Old
        else if(choice === 'dateNewToOld') {
          let sortedList = this.state.currentCampaigns.sort(function(a,b){
            return a.date - b.date
          })
          this.setState({currentCampaigns: sortedList})
        }
        //Sort End Date Old to New
        else if(choice === 'dateOldToNew') {
          let sortedList = this.state.currentCampaigns.sort(function(a,b){
            return b.date - a.date
          })
          this.setState({currentCampaigns: sortedList})
        }
        //Nothing selected
        else {
          console.log('Nothing Chosen!')
        }
      }

    render() {
        return (
       
        <>
        <form className='mb-3 form-inline' onSubmit={async (event) => {
            event.preventDefault()
            let searchInput, activeCampsInput, inactiveCampsInput, ownedCampsInput
            searchInput = this.searchInput.value.toString()
            activeCampsInput = this.activeCheckInput.checked
            inactiveCampsInput = this.inactiveCheckInput.checked
            ownedCampsInput = this.ownedCheckInput.checked
            await this.filterCampaigns(searchInput, activeCampsInput, inactiveCampsInput, ownedCampsInput) 
          }}>
          <div className='container'>
            <div className='form-row justify-content-center mb-1'>
              <div className='col-auto'>
                <div className='input-group'>
                    <img src={magnify} className='float-right mt-1' width='35' height='35' alt='magnify glass'/>
                    <input className='form-control form-control' type='text' placeholder='Search...' ref={(searchInput) => { this.searchInput = searchInput }} aria-label='Search'/>
                    <div className='col'>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='inlineCheckbox1' defaultChecked ref={(activeCheckInput) => { this.activeCheckInput = activeCheckInput }} />
                            <label className='form-check-label' htmlFor='inlineCheckbox1'>Active Campaigns</label>
                        </div>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='inlineCheckbox2' defaultChecked ref={(inactiveCheckInput) => { this.inactiveCheckInput = inactiveCheckInput }} />
                            <label className='form-check-label' htmlFor='inlineCheckbox2'>Inactive Campaigns</label>
                        </div>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='inlineCheckbox2' ref={(ownedCheckInput) => { this.ownedCheckInput = ownedCheckInput }} />
                            <label className='form-check-label' htmlFor='inlineCheckbox2'>My Campaigns</label>
                        </div>
                    </div>
                </div>
              </div>
              
              <div className='col-auto'>
                <button type='search' className='btn btn-primary mt-2' >
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className='form-group row float-right'>
            <div className='mr-5'>
                <label className='mr-2'>Sort by:</label>
                <select className='form-control-sm mb-2 mr-1' id='campaignSort' 
                    ref={(sortInputAmount) => { this.sortInputAmount = sortInputAmount }}
                    onChange={async () => {
                    this.sortCampaigns(this.sortInputAmount.value.toString())
                    await this.paginate(1)
                    }
                }
                >
                    <option value='amountContributed'>
                        Amount Contributed
                    </option>
                    <option value='goal'>
                        Goal
                    </option> 
                    <option value='dateNewToOld'>
                        Date Ending (Newest to Oldest)
                    </option> 
                    <option value='dateOldToNew'>
                        Date Ending (Oldest to Newest)
                    </option>                            
                </select>
            </div>
        </div>

        <div className='container-fluid d-flex justify-content-center' id='active-camps-container'>
            {this.state.currentCampaigns.length === 0 ? <h1 className='mt-4'>No Campaigns Found!</h1> : 
            <div className='card-group justify-content-center'>
              {this.state.currentCampaigns.map(campaign => (
                <React.Fragment key={campaign.id}>  
                    <div className='row' key={campaign.id}>
                        <Card
                            web3={this.props.web3}  
                            
                            {...this.props.contributionsState.length > 1 ?
                                <>
                                  contribution={this.props.contributionsState[campaign.id][1]}
                                </>
                            : null}
                            
                            campaign = {campaign}
                            fundCampaign={this.props.fundCampaign}
                            account={this.props.account}
                            withdraw={this.props.withdraw}
                            isFinished={this.props.isFinished}
                            withdrawed={this.props.withdrawed}
                        />
                    </div>   
                </React.Fragment>
                ))}
            </div>
            }
        </div>
        <PageNav 
            postsPerPage={this.state.postsPerPage}
            totalPosts={this.state.currentCampaigns.length}
            paginate={this.paginate}
            currentPage={this.state.currentPage}
        />
        <div className='row float-right'>
            
            <label className='mr-2'>Campaigns Per Page:</label>
            <select className='form-control-sm mb-2 mr-5' id='CampaignsPerPage' 
                ref={(campsPerPage) => { this.campsPerPage = campsPerPage }}
                onChange={async () => {
                    await this.setState({postsPerPage: this.campsPerPage.value.toString()})
                    await this.paginate(1)
                }}
            >
                <option value='3'>
                    3
                </option>
                <option value='6'>
                    6
                </option> 
                <option value='9'>
                    9
                </option> 
                <option value='12'>
                    12
                </option>                            
            </select>
        </div>
        </>
        
    )
    }
  }

  export default OwnedCampaigns;