import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';
import { Icon } from 'react-materialize';

class FindAClass extends Component {
  render() {
    return (
      <div
        id="find_class"
        className="landingbtn grey-text text-lighten-3"
        onClick={() => this.props.fetchView('findAClass')}
      >
        <Icon>find_in_page</Icon>
        <a className="clickable grey-text text-lighten-3">Find a class</a>
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(FindAClass);
