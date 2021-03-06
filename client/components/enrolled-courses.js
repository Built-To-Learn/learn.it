import React from 'react';
import { connect } from 'react-redux';
import { loadCourses } from '../store/courses';
import { loadEnrollments } from '../store/enrollments';
import M from 'materialize-css';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { fetchRoom } from '../store/dashboard';
import { fetchView, fetchClearView } from '../store/view';
import ReactTooltip from 'react-tooltip';
import { loadSingleCourse } from '../store/single-course';
import { fetchDiscussion } from '../store/discussion';

class EnrolledCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  componentDidMount() {
    this.props.getEnrollments(this.props.auth);
  }

  async joinRoomWatch(teacher, courseId) {
    // this.setState({ room: e.target.id, type: 'watcher' });
    // e.persist();
    await this.props.fetchClearView();
    // console.log('this is hte orom', e.target.id, teacher);
    this.props.fetchRoom({
      room: courseId,
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
          className="grey darken-2"
          icon={<Icon>cast_connected</Icon>}
          node="div"
          onSelect={() => {}}
        >
          <ul>
            {enrolledCourses.map((enrollment, idx) => (
              <li
                key={enrollment.course.id}
                className="fuctional_course_list_item"
              >
                <a
                  className="clickable"
                  id={enrollment.course.id}
                  onClick={(e) =>
                    this.joinRoomWatch(
                      enrollment.course.userId,
                      enrollment.course.id
                    )
                  }
                >
                  {enrollment.course.title}
                </a>
                <div>
                  <Icon
                    data-tip
                    data-for="func_info_btn"
                    className="hover_text"
                    onClick={() => {
                      this.props.fetchView('viewSingleCourse');
                      this.props.loadSingleCourse(enrollment.course);
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
                      this.props.fetchDiscussion(enrollment.course);
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
                    onClick={(e) =>
                      this.joinRoomWatch(
                        enrollment.course.userId,
                        enrollment.course.id
                      )
                    }
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
    } else {
      return (
        <CollapsibleItem
          expanded={false}
          header="Enrolled Classes"
          className="grey darken-2"
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
    fetchDiscussion: (course) => {
      dispatch(fetchDiscussion(course));
    },
    loadSingleCourse: (course) => dispatch(loadSingleCourse(course)),
  };
};

export default connect(mapState, mapDispatch)(EnrolledCourses);
