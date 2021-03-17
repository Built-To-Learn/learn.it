import React from 'react'
import { connect } from 'react-redux'
import { loadCourses } from '../store/courses'
import { loadEnrollments } from '../store/enrollments'
import M from 'materialize-css'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'

class EnrolledCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.props.getEnrollments(this.props.auth)
    }

    render() {
        const userId = this.props.auth
        if (this.props.enrollments.length !== 0) {
            const enrolledCourses = this.props.enrollments
            console.log('HELLO', enrolledCourses)

            return (
                <CollapsibleItem
                    expanded={false}
                    header="Enrolled Classes"
                    icon={<Icon>cast_connected</Icon>}
                    node="div"
                    onSelect={() => {}}
                >
                    {enrolledCourses.map((enrollment, idx) => (
                        <p key={idx}>{enrollment.course.title}</p>
                    ))}
                </CollapsibleItem>
            )
        } else {
            return (
                <CollapsibleItem
                    expanded={false}
                    header="Enrolled Classes"
                    icon={<Icon>cast_connected</Icon>}
                    node="div"
                    onSelect={() => {}}
                >
                    No Classes
                </CollapsibleItem>
            )
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

export default connect(mapState, mapDispatch)(EnrolledCourses)
