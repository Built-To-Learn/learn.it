import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from '../store';
import { loadCourses } from '../store/courses';
import M from 'materialize-css';
import CourseCard from './course-card';

class CoursesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    this.props.getCourses();
  }

  render() {
    if (this.props.courses.length !== 0) {
      const courses = this.props.courses.all;
      const enrollments = this.props.enrollments.map(
        (enroll) => enroll.courseId
      );
      return (
        <ul id="find_a_class_course_list">
          {courses.map((course, idx) => {
            return (
              <CourseCard
                className="course_list"
                course={course}
                key={`${idx}-${!!enrollments.includes(course.id)}`}
                enrolled={!!enrollments.includes(course.id)}
              />
            );
          })}
        </ul>
      );
    } else {
      return <div>No Courses</div>;
    }
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    courses: state.courses,
    enrollments: state.enrollments,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getCourses: () => {
      dispatch(loadCourses());
    },
  };
};

export default connect(mapState, mapDispatch)(CoursesView);
