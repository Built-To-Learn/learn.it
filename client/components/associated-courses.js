import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { loadCourses } from '../store/courses'
import M from 'materialize-css'
import { CourseCard } from './course-card'

class AssociatedCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        console.log('mounting')
        this.props.getCourses()
    }

    render() {
        const userId = this.props.auth

        if (this.props.courses.courses.length !== 0) {
            const courses = this.props.courses.courses
            const usersTaughtCourses = courses.filter(
                (course) => course.userId === userId
            )

            return usersTaughtCourses.map((course) => {
                return (
                    <div key={course.id}>
                        <p key={course.id}>{course.title}</p>
                    </div>
                )
            })
        } else {
            return <div>You don't have any classes</div>
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
        auth: state.auth.id,
    }
}

const mapDispatch = (dispatch) => {
    return {
        getCourses: () => {
            dispatch(loadCourses())
        },
    }
}

export default connect(mapState, mapDispatch)(AssociatedCourses)
