import React, { Component } from 'react';
import PageNav from './PageNav.js'
import Card from './Card.js'

class OwnedCampaigns extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            postsPerPage: 3,
            currentCampaigns:[]
        }
        this.paginate = this.paginate.bind(this)
    }

    async componentDidMount() {
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.campaigns.slice(indexOfFirstPost, indexOfLastPost)
        console.log('Current Campaign List : ', currentPosts)
        console.log('Setting the current campaigns state')
        await this.setState({currentCampaigns: currentPosts}, () => {
        console.log('Current Camp state:', this.state.currentCampaigns);
        console.log('Current Page:', this.state.currentPage)
        })
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


    render() {
        return (
       
        <>
        <div className='container-fluid d-flex justify-content-center' id="active-camps-container">
            <div className='card-group justify-content-center'>
              {this.state.currentCampaigns.map(campaign => (
                <>
                      
                    <div className='row' key={campaign.id}>
                    <Card
                        contribution={this.props.contributionsState[campaign.id][1]}
                        campaign = {campaign}
                        fundCampaign={this.props.fundCampaign}
                        account={this.props.account}
                        withdraw={this.props.withdraw}
                        isFinished={this.props.isFinished}
                        withdrawed={this.props.withdrawed}
                    />
                    </div> 
                      
                </>
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