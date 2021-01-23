import React, { Component } from 'react';

class CreateCampaign extends Component {

    async componentWillMount() {
        this.getCurrentTime()
    }

      getCurrentTime() {
        var date = new Date()
        var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
        console.log('Current Time:', isoDateTime)
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
                            campGoal = window.web3.utils.toWei(this.goal.value.toString(), 'Ether')
                            this.props.createCampaign(campName, campDuration, campGoal)
                            this.name.value = null
                            this.duration.value = null
                            this.goal.value = null
              }}>
                        
                        <div className='input-group form-row justify-content-center'>
                          <div className='form-group col-md-6 '>
                            <label>Name of Campaign</label>
                            <input
                            type='text'
                            ref={(name) => { this.name = name }}
                            className='form-control form-control-lg'
                            placeholder='Campaign Name'
                            required />
                          </div>
                        </div>
                        
                        <div className='input-group form-row justify-content-center'>
                          <div className='form-group col-md-5'>
                            <label className='text-center'>Date</label>
                              <input
                                type='datetime-local'
                                ref={(duration) => { this.duration = duration }}
                                className='form-control form-control-lg'
                                step='any'
                                min={this.state.currentDate}
                                required 
                              /> 
                          </div>
                          

                            <div className='form-group col-md-2'>
                            <label className='text-center'>Goal (in Ether)</label>
                              <input
                              type='number'
                              step='.01'
                              ref={(goal) => { this.goal = goal }}
                              className='form-control form-control-lg'
                              placeholder='0 ETH'
                              min='.01'
                              required /> 
                            </div>
                          </div>
                        
                        <button type='submit' className='btn btn-success  btn-lg'>
                          Create Campaign
                        </button>
              </form>
              </>
      );
    }
  }
  
  export default CreateCampaign;