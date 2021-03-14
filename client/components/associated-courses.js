import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { logout } from '../store'
import { loadCourses } from '../store/courses'
import M from 'materialize-css'
import { CourseCard } from './course-card'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'

class AssociatedCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.props.getCourses()
        let elems = document.querySelectorAll('.collapsible')
        M.Collapsible.init(elems)
    }

    // async componentDidUpdate() {
    //     var elems = document.querySelectorAll('.collapsible')
    //     M.Collapsible.init(elems, options)
    // }

    render() {
        const userId = this.props.auth

        if (this.props.courses.courses.length !== 0) {
            const courses = this.props.courses.courses
            const usersTaughtCourses = courses.filter(
                (course) => course.userId === userId
            )

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
