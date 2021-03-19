//switch view, and pass down id to getSingleCourseViewRoute
import React from 'react'
import { connect } from 'react-redux'

import M from 'materialize-css'
import CourseCard from './course-card'
import singleCourse from '../store/single-course'
import {
    CardPanel,
    Row,
    Col,
    Parallax,
    Slider,
    Slide,
    Caption,
} from 'react-materialize'

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
                <Slider
                    fullscreen={false}
                    options={{
                        duration: 500,
                        height: 300,
                        indicators: true,
                        interval: 6000,
                    }}
                >
                    <Slide
                        image={
                            <img
                                alt=""
                                src="http://lorempixel.com/780/580/nature/1"
                            />
                        }
                    >
                        <Caption placement="left">
                            <h3>{singleCourse.title}!</h3>
                            <h5 className="light grey-text text-lighten-3">
                                Here's our small slogan.
                            </h5>
                        </Caption>
                    </Slide>
                    <Slide
                        image={
                            <img
                                alt=""
                                src="http://lorempixel.com/780/580/nature/2"
                            />
                        }
                    >
                        <Caption placement="left">
                            <h5 className="light grey-text text-lighten-3">
                                {singleCourse.description}
                            </h5>
                        </Caption>
                    </Slide>
                    {/* <Slide
                        image={
                            <img
                                alt=""
                                src="https://lorempixel.com/780/580/nature/3"
                            />
                        }
                    >
                        <Caption placement="right">
                            <h3>Right Aligned Caption</h3>
                            <h5 className="light grey-text text-lighten-3">
                                Here's our small slogan.
                            </h5>
                        </Caption>
                    </Slide>
                    <Slide
                        image={
                            <img
                                alt=""
                                src="https://lorempixel.com/580/250/nature/4"
                            />
                        }
                    >
                        <Caption placement="center">
                            <h3>This is our big Tagline!</h3>
                            <h5 className="light grey-text text-lighten-3">
                                Here's our small slogan.
                            </h5>
                        </Caption>
                    </Slide> */}
                </Slider>
                <Row>
                    <Col m={12} s={12}>
                        <CardPanel className="teal">
                            <span className="white-text">
                                Description: {singleCourse.description}
                            </span>
                        </CardPanel>
                    </Col>
                </Row>
                <img
                    style={{ height: '250px', width: '250px' }}
                    src="/assets/default.jpeg"
                ></img>
                <p>Course Creator: {singleCourse.user.name}</p>
                <p>Category: {singleCourse.category}</p>
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
