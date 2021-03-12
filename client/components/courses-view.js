import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { loadCourses } from '../store/courses'
import M from 'materialize-css'

class CoursesView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        console.log('mounting')
        this.props.getCourses()
    }

    render() {
        if (this.props.courses.courses.length !== 0) {
            const courses = this.props.courses.courses
            console.log(courses)

            return courses.map((course, idx) => {
                return (
                    <div key={idx}>
                        <p>{course.title}</p>
                    </div>
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