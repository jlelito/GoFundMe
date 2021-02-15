import React, { Component } from 'react';
import PageNav from './PageNav.js';
import Card from './Card.js';

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
        await this.setState({currentCampaigns: currentPosts})
    }

    //Change Page
    async paginate (pageNumber) {
        await this.setState({currentPage: pageNumber})
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage
        const currentPosts = this.props.campaigns.slice(indexOfFirstPost, indexOfLastPost)
        await this.setState({currentCampaigns: currentPosts})
    }


    render() {
        return (
        <>
        <div className='container-fluid d-flex justify-content-center' id="owned-camps-container">
            <div className='card-group justify-content-center'>
              {this.state.currentCampaigns.map(campaign => (
                <React.Fragment key={campaign.id}>    
                    <div className='row'>
                        <Card
                            web3={this.props.web3}
                            key={campaign.id}
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