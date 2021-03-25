import React from 'react';
import M from 'materialize-css';
import { connect } from 'react-redux';
import { handleEnrollment } from '../store';
import { enrollInCourse } from '../store/enrollments';
import { fetchView } from '../store/view';
import { loadSingleCourse } from '../store/single-course';
import { Card, Icon } from 'react-materialize';

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const course = this.props.course;
    const userId = this.props.auth;

    return (
      <div className="card hoverable course_card">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="activator" src="assets/elearning.png" />
        </div>
        <div className="card-content">
          <span className="card-title activator grey-text text-darken-4">
            {course.title}
            <i className="material-icons right three_dots">more_vert</i>
          </span>
          <p>
            <a
              onClick={() =>
                this.props.enrollInCourse(course.id, userId, course.title)
              }
            >
              Enroll
            </a>
          </p>
          <p
            onClick={() => {
              this.props.fetchView('viewSingleCourse');
              this.props.loadSingleCourse(course);
            }}
          >
            <a>View More Details</a>
          </p>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">
            {course.title}
            <i className="material-icons right close_X">close</i>
          </span>
          <p>
            Here is some more information about this product that is only
            revealed once clicked on.
          </p>
        </div>
      </div>
      //   </div>
      // </div>
    );
  }
}

const mapState = (state) => {
  return {
    auth: state.auth.id,
    // isLoggedIn: !!state.auth.id,
    // courses: state.courses,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCourses: () => {
      dispatch(loadCourses());
    },
    enrollInCourse: (courseId, userId, courseTitle) =>
      dispatch(enrollInCourse(courseId, userId, courseTitle)),
    fetchView: (view) => dispatch(fetchView(view)),

    loadSingleCourse: (course) => dispatch(loadSingleCourse(course)),
  };
};

export default connect(mapState, mapDispatch)(CourseCard);
