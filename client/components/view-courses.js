import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchView } from '../store/view';
import { Icon } from 'react-materialize';

class ViewCourses extends Component {
  render() {
    return (
      <div
        id="view_class"
        className="landingbtn"
        onClick={() => this.props.fetchView('viewClasses')}
      >
        <Icon>apps</Icon>
        <span className="landingbtn_text">View all classes</span>
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(ViewCourses);
