import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { loadCourses } from '../store/courses';

/**
 * COMPONENT
 */
export const Home = ({auth, courses, getCourses}) => {

  useEffect(() => {
    getCourses()
  }, [])

  return (
    <div className="section center">
      <h3>Welcome, {auth.email}</h3>

      <div>
        {courses.length > 0 ?
        <div className="row">
          <div className=" container">
            {courses.map(course =>
            <div className="card-space">
              <div key={course.id} className="card small col s4">
                <div className="card-content">
                  <div className="">
                    <span className="card-title">{course.title}</span>
                  </div>
                  <p className="">{course.description}</p>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
        : ""}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    auth: state.auth,
    courses: state.courses.all.slice(0, 3)
  }
}

const mapDispatch = dispatch => {
  return {
    getCourses: () => dispatch(loadCourses())
  }
}
export default connect(mapState, mapDispatch)(Home)
