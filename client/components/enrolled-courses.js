import React from 'react';
import { connect } from 'react-redux';
import { loadCourses } from '../store/courses';
import { loadEnrollments } from '../store/enrollments';
import M from 'materialize-css';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { fetchRoom } from '../store/dashboard';
import { fetchView, fetchClearView } from '../store/view';

class EnrolledCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  componentDidMount() {
    this.props.getEnrollments(this.props.auth);
  }

  async joinRoomWatch(teacher, e) {
    // this.setState({ room: e.target.id, type: 'watcher' });
    e.persist();
    await this.props.fetchClearView();
    // console.log('this is hte orom', e.target.id, teacher);
    this.props.fetchRoom({
      room: e.target.id,
      type: 'watcher',
      teacher: teacher,
    });
    this.props.fetchView('dashboard');
  }

  render() {
    const userId = this.props.auth;
    if (this.props.enrollments.length !== 0) {
      const enrolledCourses = this.props.enrollments;

      return (
        <CollapsibleItem
          expanded={false}
          header="Enrolled Classes"
          icon={<Icon>cast_connected</Icon>}
          node="div"
          onSelect={() => {}}
        >
          <ul>
            {enrolledCourses.map((enrollment, idx) => (
              <li key={enrollment.course.id}>
                <a
                  className="clickable waves-effect"
                  id={enrollment.course.id}
                  onClick={(e) =>
                    this.joinRoomWatch(enrollment.course.userId, e)
                  }
                >
                  {enrollment.course.title}
                </a>
              </li>
            ))}
          </ul>
        </CollapsibleItem>
      );
    } else {
      return (
        <CollapsibleItem
          expanded={false}
          header="Enrolled Classes"
          icon={<Icon>cast_connected</Icon>}
          node="div"
          onSelect={() => {}}
        >
          No Classes
        </CollapsibleItem>
      );
    }
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    courses: state.courses,
    auth: state.auth.id,
    enrollments: state.enrollments,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCourses: () => {
      dispatch(loadCourses());
    },

    getEnrollments: (userId) => {
      dispatch(loadEnrollments(userId));
    },
    fetchRoom: (data) => {
      dispatch(fetchRoom(data));
    },
    fetchView: (view) => {
      dispatch(fetchView(view));
    },
    fetchClearView: () => {
      dispatch(fetchClearView());
    },
  };
};

export default connect(mapState, mapDispatch)(EnrolledCourses);
