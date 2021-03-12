import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';

class ViewCourses extends Component {
  render() {
    return (
      <div
        id="view_class"
        className="landingbtn"
        onClick={() => this.props.fetchView('viewClasses')}
      >
        <span>View all classes</span>
        <img id="magglass" src="magglass.png" height="20px" width="20px" />
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(ViewCourses);
