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
                    // <div key={idx}>
                    //     <p>{course.title}</p>
                    // </div>
                    <div class="row">
                        <div class="col s13 m3">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img
                                        class="activator"
                                        src="assets/elearning.png"
                                    />
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">
                                        {course.title}
                                        <i class="material-icons right">
                                            more_vert
                                        </i>
                                    </span>
                                    <p>
                                        <a href="#">Enroll</a>
                                    </p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">
                                        {course.title}
                                        <i class="material-icons right">
                                            close
                                        </i>
                                    </span>
                                    <p>
                                        Here is some more information about this
                                        product that is only revealed once
                                        clicked on.
                                    </p>
                                </div>
                            </div>
                        </div>
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
