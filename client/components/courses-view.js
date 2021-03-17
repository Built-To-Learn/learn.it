import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { loadCourses } from '../store/courses'
import M from 'materialize-css'
import CourseCard from './course-card'

class CoursesView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        this.props.getCourses()
    }

    render() {
        if (this.props.courses.length !== 0) {
            const courses = this.props.courses

            return courses.map((course) => {
                return (
                    <CourseCard
                        className="course_list"
                        course={course}
                        key={course.id}
                    />
                )
            })
        } else {
            return <div>No Courses</div>
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
    }
}

const mapDispatch = (dispatch) => {
    return {
        getCourses: () => {
            dispatch(loadCourses())
        },
    }
}

export default connect(mapState, mapDispatch)(CoursesView)
