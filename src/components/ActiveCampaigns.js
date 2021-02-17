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
        console.log('Current Page:', this.state.currentPage)
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.campaigns.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentCampaigns: currentPosts})
    }

    async sortCampaigns(search, ActiveCamps, InactiveCamps) {
        let newFilteredCampaigns = this.props.campItems.filter(campaign => 
            campaign.name.toLowerCase().includes(search.toLowerCase())
        )

        this.setState({filteredCampaigns: newFilteredCampaigns}) 
    }

    render() {
        return (
       
        <>

        <form className='mb-3 form-inline' onSubmit={async (event) => {
            event.preventDefault()
            let searchInput, activeCampsInput, inactiveCampsInput
            searchInput = this.searchInput.value.toString()
            activeCampsInput = this.activeCheckInput.checked
            inactiveCampsInput = this.inactiveCheckInput.checked
            console.log('Active input', activeCampsInput)
            console.log('InActive input', inactiveCampsInput)
            await this.sortCampaigns(searchInput, activeCampsInput, inactiveCampsInput)
            this.paginate(1) 
          }}>
          <div className='container'>
            <div className='form-row justify-content-center mb-1'>
              <div className='col-auto'>
                <div className='input-group'>
                    <img src={magnify} className='float-right mt-1' width='35' height='35' alt='magnify glass'/>
                    <input className='form-control form-control' type='text' placeholder='Search...' ref={(searchInput) => { this.searchInput = searchInput }} aria-label='Search'/>
                    <div className='col'>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='inlineCheckbox1' ref={(activeCheckInput) => { this.activeCheckInput = activeCheckInput }} />
                            <label className='form-check-label' for='inlineCheckbox1'>Active Campaigns</label>
                        </div>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='inlineCheckbox2' ref={(inactiveCheckInput) => { this.inactiveCheckInput = inactiveCheckInput }} />
                            <label className='form-check-label' for='inlineCheckbox2'>Inactive Campaigns</label>
                        </div>
                    </div>
                </div>
              </div>
              
              <div className='col-auto'>
                <button type='submit' className='btn btn-primary mt-2' >
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className='container-fluid d-flex justify-content-center' id='active-camps-container'>
            <div className='card-group justify-content-center'>
              {this.state.currentCampaigns.map(campaign => (
                <React.Fragment key={campaign.id}>  
                    <div className='row' key={campaign.id}>
                        <Card
                            web3={this.props.web3}                     
                            contribution={this.props.contributionsState[campaign.id][1]}
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
        </div>
        <PageNav 
            postsPerPage={this.state.postsPerPage}
            totalPosts={this.props.campaigns.length}
            paginate={this.paginate}
            currentPage={this.state.currentPage}
        />
        </>
        
    )
    }
  }

  export default OwnedCampaigns;