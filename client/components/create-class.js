import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';

class CreateAClass extends Component {
  render() {
    return (
      <div
        id="create_class"
        className="landingbtn"
        onClick={() => this.props.fetchView('createAClass')}
      >
        <span>Create a class</span>
        <img id="magglass" src="magglass.png" height="20px" width="20px" />
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(CreateAClass);
