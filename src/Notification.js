import React, { Component } from 'react';
import { Row, Col, Toast, Button } from 'react-bootstrap';


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
        <Row>
            
            <Toast show={this.state.showA} onClose={this.updateCloseNotify}>
                <Toast.Header>
                <img
                    src="holder.js/20x20?text=%20"
                    className="rounded mr-2"
                    alt=""
                />
                <strong className="mr-auto">{this.props.action}</strong>
                <small>11 mins ago</small>
                </Toast.Header>
                
                <Toast.Body>
                <div className='container row'>
                    <div className='col-lg-6'>
                        <div>{this.props.action} Transaction: </div>
                        <a className="text-green ml-2" href={`https://ropsten.etherscan.io/tx/${this.props.hash}`} target="_blank">
                            {this.props.hash}
                         </a>
                    </div>
                </div>
                </Toast.Body>
            </Toast>  
        </Row>
        );
    }
  }

  export default Notification;