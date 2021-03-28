import React from 'react';
import { connect } from 'react-redux';
// import { loadCourses } from '../store/courses';
import { loadEnrollments } from '../store/enrollments';
import M from 'materialize-css';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { loadCourses, loadUserCourses } from '../store/courses';
import { fetchRoom } from '../store/dashboard';
import { fetchView, fetchClearView } from '../store/view';
import ReactTooltip from 'react-tooltip';
import { loadSingleCourse } from '../store/single-course';
import { fetchDiscussion } from '../store/discussion';

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
            <li key={course.id} className="fuctional_course_list_item">
              <a
                className="clickable waves-effect"
                id={course.id}
                onClick={(e) => {
                  this.joinRoomBroadcast(course.userId, e);
                }}
              >
                {course.title}
              </a>
              <div>
                <Icon
                  data-tip
                  data-for="func_info_btn"
                  className="hover_text"
                  onClick={() => {
                    this.props.fetchView('viewSingleCourse');
                    this.props.loadSingleCourse(course);
                  }}
                >
                  info_outline
                </Icon>
                <ReactTooltip id="func_info_btn" className="tooltipClass">
                  Course Info
                </ReactTooltip>

                <Icon
                  data-tip
                  data-for="func_chat_btn"
                  className="hover_text"
                  onClick={() => {
                    this.props.fetchView('discussion');
                    this.props.fetchDiscussion(course);
                  }}
                >
                  chat
                </Icon>
                <ReactTooltip id="func_chat_btn" className="tooltipClass">
                  Discussion Board
                </ReactTooltip>

                <Icon
                  data-tip
                  data-for="func_video_btn"
                  onClick={(e) => {
                    this.joinRoomBroadcast(course.userId, e);
                  }}
                  className="hover_text"
                >
                  ondemand_video
                </Icon>

                <ReactTooltip id="func_video_btn" className="tooltipClass">
                  Classroom
                </ReactTooltip>
              </div>
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
    fetchDiscussion: (course) => {
      dispatch(fetchDiscussion(course));
    },
    loadSingleCourse: (course) => dispatch(loadSingleCourse(course)),
  };
};

export default connect(mapState, mapDispatch)(TaughtCourses);
