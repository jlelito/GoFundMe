import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import bell from './src_images/bell-icon.png';


class Notification extends Component {

    updateShowNotify = () => this.setState({showA: true});
    updateCloseNotify = () => this.setState({showA: false})

    constructor(props) {
        super(props)
        this.state= {
            showA: this.props.showNotification
        }
    }

    render() {
        return (
        <div className='row fixed-top mt-5'>
            <Toast className='mt-4 ml-4' show={this.state.showA} onClose={this.updateCloseNotify}>
                <Toast.Header>
                <img
                    src={bell}
                    className="rounded mr-2"
                    alt=""
                    height='25'
                    width='25'
                />
                <strong className="mr-auto">{this.props.action}</strong>
                <small>1 second ago</small>
                </Toast.Header>
                
                <Toast.Body>
                <div className='row'>
                    <div className='col-12 float-left'>
                        <div className='text-success'><b>{this.props.action}</b></div>

                        {this.props.name != null ? 
                        <div>Campaign Name: {this.props.name}</div>
                            : null
                        }

                        {this.props.amount != null ? 
                            <div>
                                Amount: {window.web3.utils.fromWei(this.props.amount, 'Ether')} ETH
                            </div>
                        : null}
                        Transaction:
                        <a className="ml-2" href={`https://ropsten.etherscan.io/tx/${this.props.hash}`} target="_blank" rel="noreferrer">
                            Link
                        </a>
                        
                    </div>
                </div>
                </Toast.Body>
            </Toast>  
        </div>
        );
    }
  }

  export default Notification;