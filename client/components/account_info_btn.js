import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';

class AccountInfoBtn extends Component {
  render() {
    return (
      <div
        id="account_info"
        className="account_info_btn valign-wrapper"
        onClick={() => this.props.fetchView('accountInfo')}
      >
        <i className="small material-icons">account_circle</i>
        <span>Account Info</span>

      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(AccountInfoBtn);
