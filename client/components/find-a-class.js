import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';

class FindAClass extends Component {
  render() {
    return (
      <div id="find_class" onClick={() => this.props.fetchView('findAClass')}>
        <span>Find a class</span>
        <img id="magglass" src="magglass.png" height="20px" width="20px" />
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(FindAClass);
