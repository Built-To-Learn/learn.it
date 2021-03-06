import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dashboard,
  ClassSearch,
  CoursesView,
  AccountInfoBtn,
  AccountInfo,
  AssociatedCourses,
  EnrolledCourses,
  SingleCourseView,
  Home,
  Discussion,
} from './index';
import { CreateNewCourse } from './createclass';
import { fetchView } from '../store/view';
import { fetchClearStudentBreakout } from '../store/student-breakout';
import { fetchRoom } from '../store/dashboard';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { room: '', type: '' };
    // this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    // this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }

  //   joinRoomBroadcast(e) {
  //     this.setState({ room: e.target.id, type: 'broadcast' });
  //     this.props.fetchView('dashboard');
  //   }
  //   joinRoomWatch(e) {
  //     this.setState({ room: e.target.id, type: 'watcher' });
  //     this.props.fetchView('dashboard');
  //   }

  componentDidMount() {
    this.props.fetchView('welcome');
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.studentBreakout.active !== this.props.studentBreakout.active
    ) {
      if (!!this.props.studentBreakout.active) {
        this.props.fetchRoom({
          room: this.props.studentBreakout.room,
          type: 'breakout',
          teacher: this.props.dashboard.teacher,
        });
        // this.setState({
        //   room: this.props.studentBreakout.room,
        //   type: 'breakout',
        // });
        this.props.fetchView(`breakout`);
      }
    } else if (
      !this.props.studentBreakout.active &&
      !!this.props.studentBreakout.return
    ) {
      this.props.fetchRoom({
        room: this.props.studentBreakout.room,
        type: this.props.studentBreakout.type,
        teacher: this.props.dashboard.teacher,
      });
      //   this.setState({
      //     room: this.props.studentBreakout.room,
      //     type: this.props.studentBreakout.type,
      //   });
      this.props.fetchClearStudentBreakout();
      this.props.fetchView('dashboard');
    }

    // if (
    //   !prevProps.studentBreakout.return &&
    //   !!this.props.studentBreakout.return
    // ) {
    // this.setState({
    //   room: this.props.studentBreakout.room,
    //   type: this.props.studentBreakout.type,
    // });
    // this.props.fetchClearStudentBreakout();
    // this.props.fetchView('dashboard');
    // }
  }

  render() {
    const view = this.props.view;
    console.log('dashboard', this.props.dashboard);
    return (
      <div id="dashboard" className="border">
        <div id="left" className="border">
          <AssociatedCourses />
        </div>
        <div id="right" className="border">
          {view === 'dashboard' ? (
            <Dashboard
              room={this.props.dashboard.room}
              type={this.props.dashboard.type}
              teacher={this.props.dashboard.teacher}
            />
          ) : (
            ''
          )}
          {view === 'breakout' ? (
            <Dashboard
              room={this.props.dashboard.room}
              type={this.props.dashboard.type}
              teacher={this.props.dashboard.teacher}
            />
          ) : (
            ''
          )}
          {view === 'welcome' ? <Home /> : ''}
          {view === 'findAClass' ? <ClassSearch /> : ''}
          {view === 'createAClass' ? <CreateNewCourse /> : ''}
          {view === 'viewClasses' ? <CoursesView /> : ''}
          {view === 'accountInfo' ? <AccountInfo /> : ''}
          {view === 'viewSingleCourse' ? <SingleCourseView /> : ''}
          {view === 'discussion' ? <Discussion /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ view, studentBreakout, dashboard }) => {
  return {
    view: view,
    studentBreakout: studentBreakout,
    dashboard: dashboard,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
    fetchClearStudentBreakout: () => dispatch(fetchClearStudentBreakout()),
    fetchRoom: (data) => dispatch(fetchRoom(data)),
  };
};

export default connect(mapStateToProps, mapDispatch)(Landing);
