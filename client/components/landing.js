import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dashboard,
  FindAClass,
  ClassSearch,
  CreateAClass,
  ViewCourses,
  CoursesView,
  AccountInfoBtn,
  AccountInfo,
  AssociatedCourses,
} from './index';
import { CreateNewCourse } from './createclass';
import { fetchView } from '../store/view';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { room: '', type: '' };
    this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }

  joinRoomBroadcast(e) {
    this.setState({ room: e.target.id, type: 'broadcast' });
    this.props.fetchView('dashboard');
  }
  joinRoomWatch(e) {
    this.setState({ room: e.target.id, type: 'watcher' });
    this.props.fetchView('dashboard');
  }

  componentDidUpdate(prevProps) {
    console.log('props', prevProps.studentBreakout.active);
    if (
      prevProps.studentBreakout.active !== this.props.studentBreakout.active
    ) {
      if (!!this.props.studentBreakout.active) {
        this.setState({
          room: this.props.studentBreakout.room,
          type: 'breakout',
        });
        this.props.fetchView(`breakout`);
      }
    }
  }

  render() {
    console.log('view', this.props.view);
    const view = this.props.view;
    return (
      <div id="dashboard" className="border">
        <div id="left" className="border">
          <button id="room1" onClick={(e) => this.joinRoomBroadcast(e)}>
            Join room as teacher
          </button>
          <button id="room1" onClick={(e) => this.joinRoomWatch(e)}>
            Join room as watcher
          </button>
          <AccountInfoBtn />
          <CreateAClass />
          <FindAClass />
          <ViewCourses />
          <AssociatedCourses />
        </div>
        <div id="right" className="border">
          {view === 'dashboard' ? (
            <Dashboard room={this.state.room} type={this.state.type} />
          ) : (
            ''
          )}
          {view === 'breakout' ? (
            <Dashboard room={this.state.room} type={this.state.type} />
          ) : (
            ''
          )}
          {view === 'findAClass' ? <ClassSearch /> : ''}
          {view === 'createAClass' ? <CreateNewCourse /> : ''}
          {view === 'viewClasses' ? <CoursesView /> : ''}
          {view === 'accountInfo' ? <AccountInfo /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ view, studentBreakout }) => {
  return {
    view: view,
    studentBreakout: studentBreakout,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
};

export default connect(mapStateToProps, mapDispatch)(Landing);
