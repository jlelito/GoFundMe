import React, { Component } from 'react';
import Identicon from 'identicon.js';
import pic from './src_images/download.png';
import { ProgressBar } from './../node_modules/react-bootstrap';
import ethPic from './src_images/ETH.png';

function getProgress(amount, target) {
  return ((amount/target)*100).toFixed(1);
}

function reachedGoal(camp) {
  return getProgress(camp.amount, camp.targetFunding) >= 100
}

class Card extends Component {

  constructor(props) {
  super(props);
   this.state = {
      progress : getProgress(this.props.campaign.amount, this.props.campaign.targetFunding)
      
    }
  }
  
  render() {
    return (
      <div>
        <main role='main' className='container-fluid d-flex justify-content-center'>
          <div className='card-group justify-content-center'>
              <div className='row'>
                <div className='card mb-4 mx-4' >
                  <div className='card-header'>
                    <p>Campaign Owner:</p>
                    <img
                      className='mr-2 img-rounded'
                      width='30'
                      height='30'
                      src={`data:image/png;base64,${new Identicon(this.props.campaign.owner, 30).toString()}`}
                      alt='identicon'
                    />
                    <small className='text-muted'>{this.props.campaign.owner}</small>
                  </div>
                  <ul id='campaignList' className='list-group list-group-flush'>
                    <li className='list-group-item'>
                      <p className='text-center'><img src={pic} style={{ maxWidth: '350px', maxHeight: '150px'}} alt='fundraising'/></p>
                      
                      <p><b>{this.props.campaign.name}</b></p>
                      <p>Date Ending: {(new Date(parseInt(this.props.campaign.date) * 1000)).toLocaleString()}</p>
                      <p>Amount Contributed: {window.web3.utils.fromWei(this.props.campaign.amount, 'Ether')} Ether<img src={ethPic} width='25' height='25' alt='eth logo'/></p>
                      <p><b>Goal: {window.web3.utils.fromWei(this.props.campaign.targetFunding, 'Ether')} Ether</b><img src={ethPic} width='25' height='25' alt='eth logo'/></p>
                      
                      {!reachedGoal(this.props.campaign) && this.props.isFinished(this.props.campaign) ? 
                      <ProgressBar animated variant='danger' now={this.state.progress} label={`${this.state.progress}% of Goal`}/> :
                      <ProgressBar animated variant='success' now={this.state.progress} label={`${this.state.progress}% of Goal`}/>
                      }
                      
                        {reachedGoal(this.props.campaign) && this.props.isFinished(this.props.campaign) ? 

                          <div className='text-success mt-1'><b>Reached goal</b></div>
                          : 
                          <>
                            {!reachedGoal(this.props.campaign) && this.props.isFinished(this.props.campaign) ? 
                              <div className='text-danger mt-1'><b>Did not reach Goal</b></div>
                              : null
                            }
                          </>
                        }
                        <div className='card-footer text-muted'>
                        {this.props.campaign.owner === this.props.account ? (
                          <>
                            {this.props.isFinished(this.props.campaign) && this.props.withdrawed[this.props.campaign.id] === false && reachedGoal(this.props.campaign) === true ? 
                              ( 
                              <button className='btn btn-primary btn-sm' onClick={() => this.props.withdraw(this.props.campaign.id)}>Withdraw Contributions</button> 
                              )
                              : (
                                  
                                  <>
                                      {this.props.withdrawed[this.props.campaign.id] === true ? 
                                        'Already Withdrawed!'
                                        : null
                                      }
                                  </> 
                                  
                                )
                            }
                          </>
                          )
                            
                          : 
                          <>
                          {this.props.isFinished(this.props.campaign) ? (
                          <>
                            {this.props.contribution > 0 && !reachedGoal(this.props.campaign) ? (
                            <button className='btn btn-primary btn-success btn-sm float-right' onClick={() => this.props.refund(this.props.campaign.id)}>Refund</button> 
                            )
                            : null}
                          </>
                          ) : (
                          
                              <form
                              onSubmit={(event) => {
                                  event.preventDefault()
                                  let contribute = this.input.value.toString()
                                  this.props.fundCampaign(this.props.campaign.id, contribute)
                                  this.input.value = null

                                }}
                              >
                            
                              <input
                                className='mt-3' 
                                id='targetcontribute'
                                type='number'
                                step='.01'
                                ref={(input) => { this.input = input }}
                                placeholder='0 ETH'
                                required
                              />
                              
                              <button className='btn btn-primary btn-md float-left pt-0 mt-3 mr-1' type='submit'>
                                Contribute!
                              </button>
                            </form>
                          
                          )
                          
                        }
                        </>
                      }
                        
                    <div className='py-2'>
                      <small className='float-left mt-1 text-muted'>
                        <b>Contributed: {window.web3.utils.fromWei(this.props.contribution, 'Ether')} Ether</b>
                      </small>
                    </div>
                  </div>
                </li>  
              </ul>         
            </div>
          </div>
        </div>      
      </main>
    </div>
      
    );
  
  }
}
export default Card;