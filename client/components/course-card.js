import React from 'react'
import M from 'materialize-css'
import { connect } from 'react-redux'
import { handleEnrollment } from '../store'
import { enrollInCourse } from '../store/enrollments'

class CourseCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const course = this.props.course
        const userId = this.props.auth
        return (
            <div className="row">
                <div className="col s13 m3">
                    <div className="card hoverable">
                        <div className="card-image waves-effect waves-block waves-light">
                            <img
                                className="activator"
                                src="assets/elearning.png"
                            />
                        </div>
                        <div className="card-content">
                            <span className="card-title activator grey-text text-darken-4">
                                {course.title}
                                <i className="material-icons right">
                                    more_vert
                                </i>
                            </span>
                            <p>
                                <a
                                    onClick={() =>
                                        this.props.enrollInCourse(
                                            course.id,
                                            userId
                                        )
                                    }
                                >
                                    Enroll
                                </a>
                            </p>
                        </div>
                        <div className="card-reveal">
                            <span className="card-title grey-text text-darken-4">
                                {course.title}
                                <i className="material-icons right">close</i>
                            </span>
                            <p>
                                Here is some more information about this product
                                that is only revealed once clicked on.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        auth: state.auth.id,
        // isLoggedIn: !!state.auth.id,
        // courses: state.courses,
    }
}

const mapDispatch = (dispatch) => {
    return {
        getCourses: () => {
            dispatch(loadCourses())
        },
        enrollInCourse: (courseId, userId) =>
            dispatch(enrollInCourse(courseId, userId)),
    }
}

export default connect(mapState, mapDispatch)(CourseCard)
