import React, { Component } from 'react';
import ethPic from '../src_images/ETH.png';



class ContributionsTable extends Component {

  render() {
    return (
        
        <table className='table table-striped table-hover mt-5 mr-2'>
          <caption>Contributions</caption>
            <thead className='thead-light'>
              <tr>
                <th>ID</th>
                <th>Campaign Name</th>
                <th>Contribution</th>
              </tr>
            </thead>
          <tbody>
            
            {this.props.contributionsState.map(contrib => (
              <React.Fragment key={contrib.id}> 
                {contrib[1] > 0 ? 
                  <tr key={contrib.id}>
                    <td>{contrib[0]}</td>
                    <td>{this.props.campaignList[contrib[0]].name}</td>
                    <td>{this.props.web3.utils.fromWei(contrib[1], 'Ether')} ETH<img src={ethPic} width='25' height='25' alt='eth logo'/></td>
                  </tr> 
                  : null 
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
    );
  
  }
}
export default ContributionsTable;