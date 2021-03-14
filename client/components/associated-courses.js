import React from 'react'
import { connect } from 'react-redux'
import { loadCourses } from '../store/courses'
import { loadEnrollments } from '../store/enrollments'
import M from 'materialize-css'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'

class AssociatedCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.props.getCourses()
        this.props.getEnrollments(this.props.auth)
    }

    render() {
        const userId = this.props.auth
        console.log('PROPS', this.props)
        if (this.props.courses.courses.length !== 0) {
            const courses = this.props.courses.courses
            // const enrolledCourse = this.props
            const usersTaughtCourses = courses.filter(
                (course) => course.userId === userId
            )
            console.log('userTaughtCOURSES', usersTaughtCourses)

            return (
                <div style={{ display: 'inline-block' }}>
                    <Collapsible accordion>
                        <CollapsibleItem
                            expanded={false}
                            header="Taught Classes."
                            icon={<Icon>school</Icon>}
                            node="div"
                        >
                            {usersTaughtCourses.map((course) => {
                                return <p key={course.id}>{course.title}</p>
                            })}
                        </CollapsibleItem>

                        <CollapsibleItem
                            expanded={false}
                            header="Enrolled Classes"
                            icon={<Icon>cast_connected</Icon>}
                            node="div"
                        >
                            Yeah, you do seem to have a little 'shit creek'
                            action going.
                        </CollapsibleItem>
                    </Collapsible>
                </div>
            )
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
        courses: state.courses,
        auth: state.auth.id,
        enrollments: state.enrollments,
    }
}

const mapDispatch = (dispatch) => {
    return {
        getCourses: () => {
            dispatch(loadCourses())
        },

        getEnrollments: (userId) => {
            dispatch(loadEnrollments(userId))
        },
    }
}

export default connect(mapState, mapDispatch)(AssociatedCourses)
