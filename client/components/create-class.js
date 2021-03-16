import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';
import { Icon } from 'react-materialize';

class CreateAClass extends Component {
  render() {
    return (
      <div
        id="create_class"
        className="landingbtn"
        onClick={() => this.props.fetchView('createAClass')}
      >
        <Icon>add</Icon>
        <span className="landingbtn_text">Create a class</span>
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(CreateAClass);
