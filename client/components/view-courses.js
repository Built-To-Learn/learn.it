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
        <a className="clickable waves-effect">View all classes</a>
      </div>
    );
  }
}

export default connect(null, (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
})(ViewCourses);
