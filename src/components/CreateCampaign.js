import React, { Component } from 'react';

class CreateCampaign extends Component {

    async componentDidMount() {
        this.getCurrentTime()
    }

      getCurrentTime() {
        var date = new Date()
        var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
        this.setState({currentDate: isoDateTime})
      }

    constructor(props) {
        super(props);
        this.state = {
            currentDate : null
        }
    }

    render() {
      return (
        <>
          <form className='mb-5' 
              onSubmit={(event) => {
              event.preventDefault()
              this.getCurrentTime()
              let campName, campDuration, campGoal
              campName = this.name.value
              campDuration = this.duration.value.toString()
              campGoal =this.props.web3.utils.toWei(this.goal.value.toString(), 'Ether')
              this.props.createCampaign(campName, campDuration, campGoal)
              this.name.value = null
              this.duration.value = null
              this.goal.value = null
            }}>
                          
                <div className='input-group form-row justify-content-center'>
                  <div className='form-group col-auto '>
                    <label>Name of Campaign</label>
                    <input
                    type='text'
                    ref={(name) => { this.name = name }}
                    className='form-control form-control-lg'
                    placeholder='Campaign Name'
                    required
                    disabled={!this.props.isConnected}
                    />
                  </div>
                </div>
                
                <div className='input-group form-row justify-content-center'>
                  <div className='form-group col-auto'>
                    <label className='text-center'>Date</label>
                      <input
                        type='datetime-local'
                        ref={(duration) => { this.duration = duration }}
                        className='form-control form-control-lg'
                        step='any'
                        min={this.state.currentDate}
                        required
                        disabled={!this.props.isConnected}
                      /> 
                  </div>
                  
                    <div className='form-group col-auto'>
                    <label className='text-center'>Goal (in Ether)</label>
                      <input
                      type='number'
                      step='.01'
                      ref={(goal) => { this.goal = goal }}
                      className='form-control form-control-lg'
                      placeholder='0 ETH'
                      min='.01'
                      required 
                      disabled={!this.props.isConnected}
                      /> 
                    </div>
                </div>
                
                <button type='submit' className='btn btn-success  btn-lg' disabled={!this.props.isConnected}>
                  Create Campaign
                </button>
          </form>
        </>
      );
    }
  }
  
  export default CreateCampaign;