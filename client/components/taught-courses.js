import React from 'react';
import { connect } from 'react-redux';
// import { loadCourses } from '../store/courses';
import { loadEnrollments } from '../store/enrollments';
import M from 'materialize-css';
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize';
import { loadCourses, loadUserCourses } from '../store/courses';

class TaughtCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // this.props.getEnrollments(this.props.auth)
    this.props.getUserCourses();
    this.props.getEnrollments(this.props.auth);
  }

  render() {
    //const userId = this.props.auth;
    const usersTaughtCourses = this.props.courses;

    return (
      <CollapsibleItem
        expanded={false}
        header="Taught Classes"
        icon={<Icon>school</Icon>}
        node="div"
        onSelect={() => {}}
      >
        {usersTaughtCourses.map((course) => (
          <p key={course.id}>{course.title}</p>
        ))}
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
  };
};

export default connect(mapState, mapDispatch)(TaughtCourses);
