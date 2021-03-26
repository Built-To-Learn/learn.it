import React from 'react';
import { connect } from 'react-redux';
// import { loadCourses } from '../store/courses';
import { loadEnrollments } from '../store/enrollments';
import M from 'materialize-css';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { loadCourses, loadUserCourses } from '../store/courses';
import { fetchRoom } from '../store/dashboard';
import { fetchView, fetchClearView } from '../store/view';

class TaughtCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
  }

  async joinRoomBroadcast(teacher, e) {
    // this.setState({ room: e.target.id, type: 'broadcast' });
    e.persist();
    await this.props.fetchClearView();
    this.props.fetchRoom({
      room: e.target.id,
      type: 'broadcast',
      teacher: teacher,
    });
    this.props.fetchView('dashboard');
  }

  componentDidMount() {
    // this.props.getEnrollments(this.props.auth)
    this.props.getUserCourses();
    this.props.getEnrollments(this.props.auth);
  }

  render() {
    //const userId = this.props.auth;
    const usersTaughtCourses = this.props.courses.user;
    console.log(this.props.courses);
    return (
      <CollapsibleItem
        expanded={false}
        header="Taught Classes"
        icon={<Icon>school</Icon>}
        node="div"
        onSelect={() => {}}
      >
        <ul>
          {usersTaughtCourses.map((course) => (
            <li key={course.id}>
              <a
                className="clickable waves-effect"
                id={course.id}
                onClick={(e) => {
                  this.joinRoomBroadcast(course.userId, e);
                }}
              >
                {course.title}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleItem>
    );
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
    getUserCourses: () => {
      dispatch(loadUserCourses());
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

export default connect(mapState, mapDispatch)(TaughtCourses);
