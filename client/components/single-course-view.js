//switch view, and pass down id to getSingleCourseViewRoute
import React from 'react'
import { connect } from 'react-redux'

import M from 'materialize-css'
import CourseCard from './course-card'
import singleCourse from '../store/single-course'

class SingleCourseView extends React.Component {
    constructor(props) {
        super(props)
    }
    async componentDidMount() {
        this.props.singleCourse
        console.log('SINGLE COURSE in component', singleCourse)
    }

    render() {
        const singleCourse = this.props.singleCourse
        return (
            <div>
                <p>Title: {singleCourse.title}</p>
                <p>Subject: {singleCourse.subject}</p>
                <p>Category: {singleCourse.category}</p>
                <p>Course Creator: {singleCourse.user.name}</p>
            </div>
        )
        // if (this.props.courses.length !== 0) {
        //     const courses = this.props.courses.all

        //     return courses.map((course) => {
        //         return (
        //             <CourseCard
        //                 className="course_list"
        //                 course={course}
        //                 key={course.id}
        //             />
        //         )
        //     })
        // } else {
        //     return <div>No Courses</div>
        // }
    }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        isLoggedIn: !!state.auth.id,
        courses: state.courses,
        singleCourse: state.singleCourse,
    }
}

const mapDispatch = (dispatch) => {
    return {}
}

export default connect(mapState, mapDispatch)(SingleCourseView)
