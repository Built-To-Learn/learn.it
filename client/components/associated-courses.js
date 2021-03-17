import React from 'react'
import { connect } from 'react-redux'
import { loadCourses, loadUserCourses } from '../store/courses'
import { loadEnrollments } from '../store/enrollments'
import M from 'materialize-css'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { ClassOptions, EnrolledCourses } from './index'

class AssociatedCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        //  this.props.auth
        const init = async () => {
            await this.props.getUserCourses()
            await this.props.getEnrollments(this.props.auth)
        }
        init()
    }

    render() {
        if (this.props.courses.length !== 0) {
            const usersTaughtCourses = this.props.courses

            return (
                <div style={{ display: 'inline-block' }}>
                    <Collapsible accordion>
                        <ClassOptions />
                        <CollapsibleItem
                            expanded={false}
                            header="Taught Classes."
                            icon={<Icon>school</Icon>}
                            node="div"
                        >
                            {usersTaughtCourses.map((course) => (
                                <p key={course.id}>{course.title}</p>
                            ))}
                        </CollapsibleItem>
                        <EnrolledCourses />
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
        getUserCourses: () => {
            dispatch(loadUserCourses())
        },

        getEnrollments: (userId) => {
            dispatch(loadEnrollments(userId))
        },
    }
}

export default connect(mapState, mapDispatch)(AssociatedCourses)
