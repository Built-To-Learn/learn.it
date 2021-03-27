import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { loadCourses } from '../store/courses';
import { Carousel } from 'react-materialize';
import { enrollInCourse } from '../store/enrollments';
import { fetchView } from '../store/view';
import { loadSingleCourse } from '../store/single-course';

export const Home = ({auth, courses, getCourses, enrollInCourse, fetchView, loadSingleCourse}) => {

  useEffect(() => {
    getCourses()
  }, [])

  const childrenMapped = courses.map(course => {
    return (
      <div className="carousel-item ">
        <div key={course.id} className="card carousel-card">
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" src="assets/elearning.png" />
          </div>

          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">
              {course.title}
              <i className="material-icons right three_dots">more_vert</i>
            </span>
          </div>

          <div>
            <p>
              <a
                className="hover_text"
                onClick={() => enrollInCourse(course.id, userId, course.title) }
              >
                Enroll
              </a>
            </p>

            <p
              className="hover_text"
              onClick={() => {
                fetchView('viewSingleCourse');
                loadSingleCourse(course);
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
      </div>
    )
  })

  return (
    <div className="section center">
      <h3>Welcome, {auth.email}</h3>

      <div className="valign-wrapper">
        {childrenMapped.length > 0 ?
        <Carousel
          children={
            childrenMapped
          }

          options={{
            dist: 0,
            duration: 200,
            fullWidth: false,
            indicators: false,
            noWrap: false,
            numVisible: 3,
            onCycleTo: null,
            padding: 50,
            shift: 0
          }}

        />
        : ""
        }
    </div>
    </div>
  )
}

const mapState = state => {
  return {
    auth: state.auth,
    courses: state.courses.all.slice(0, 3)
  }
}

const mapDispatch = dispatch => {
  return {
    getCourses: () => dispatch(loadCourses()),
    enrollInCourse: (courseId, userId, courseTitle) =>
      dispatch(enrollInCourse(courseId, userId, courseTitle)),
    fetchView: (view) => dispatch(fetchView(view)),

    loadSingleCourse: (course) => dispatch(loadSingleCourse(course)),
  }
}
export default connect(mapState, mapDispatch)(Home)
