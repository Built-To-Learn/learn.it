import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { loadCourses } from '../store/courses';
import { Carousel } from 'react-materialize';
import { enrollInCourse } from '../store/enrollments';
import { fetchView } from '../store/view';
import { loadSingleCourse } from '../store/single-course';
import { FindAClass, CreateAClass, ViewCourses } from './index';
import { Link } from 'react-router-dom'
export const Home = ({auth, payment, courses, getCourses, enrollInCourse, fetchView, loadSingleCourse}) => {

  useEffect(() => {
    getCourses()
  }, [])

  const childrenMapped = courses.map(course => {
    return (
      <div className="carousel-item">
        <div key={course.id} className="card grey darken-3 small carousel-card">
          <div className="card-image waves-effect waves-block waves-light">
          {course.coursePicURL ? <img className="activator small-card" src={course.coursePicURL} /> : <img className="activator" src="assets/elearning.png" />}
          </div>

          <div className="card-content">
            <span className="card-title activator grey-text text-lighten-2">
              {course.title}
              <i className="material-icons right three_dots">more_vert</i>
            </span>

            <div>
              <p>
                <a
                  className="hover_text grey-text"
                  onClick={() => enrollInCourse(course.id, userId, course.title) }
                >
                  Enroll
                </a>
              </p>

              <p>
                <a
                  className="hover_text grey-text"
                  onClick={() => {
                    fetchView('viewSingleCourse');
                    loadSingleCourse(course);
                  }}
                >
                  View More Details
                </a>
              </p>
            </div>

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
      <div className="container section">
        {auth.onboarded ?
        <div className="grey-text text-lighten-3">
          <p>Congratulations on setting up your teaching profile with stripe!</p>
        </div>
        :
        <div className="grey-text text-lighten-3">
          <p>
            Setup your teaching profile by onboarding with <a className="btn" href={payment.onboardUrl}>Stripe</a>
          </p>
        </div> }
      </div>

      <div className="section container">
        <div className="card grey darken-3">
          <div className="card-content">
            <span className="card-title deep-orange-text text-accent-1">Get Started</span>
            <div id="welcome-page-class-options">
              <FindAClass />
              <CreateAClass />
            </div>
          </div>
        </div>


      </div>

      <div className="section container">
        <h4 className="deep-orange-text text-accent-1">Top Picks</h4>
        <div id="class-carousel-wrapper">
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
    </div>
  )
}

const mapState = state => {
  return {
    auth: state.auth,
    courses: state.courses.all.slice(0, 3),
    payment: state.payment
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
