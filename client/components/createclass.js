import React from 'react'
import { connect } from 'react-redux'
import { createCourse } from '../store/courses'
import Parallax from './parallax.js'
import Icons from './icons.js'
/**
 * COMPONENT
 */
const CreateCourse = (props) => {
    const { handleSubmit, error, isLoggedIn } = props
    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <form onSubmit={handleSubmit} name={name}>
                        <div>
                            <label htmlFor="coursename">
                                <small>Course Name</small>
                            </label>
                            <input name="coursename" type="text" />
                        </div>
                        <div>
                            <label htmlFor="Subject">
                                <small>Subject</small>
                            </label>
                            <input name="subject" type="text" />
                        </div>
                        <div>
                            <label htmlFor="Category">
                                <small>Category</small>
                            </label>
                            <input name="category" type="text" />
                        </div>
                        <div>
                            <button type="submit">Create Course</button>
                        </div>
                        {error && error.response && (
                            <div> {error.response.data} </div>
                        )}
                    </form>
                    <a href="/viewcourses">link text</a>
                </div>
            ) : (
                <p>Must Be Logged In to Create a Class</p>
            )}
        </div>
    )
}

const mapCreateCourse = (state) => {
    return {
        isLoggedIn: !!state.auth.id,
    }
}

const mapDispatch = (dispatch) => {
    return {
        handleSubmit(evt) {
            evt.preventDefault()
            // const formName = evt.target.name
            const title = evt.target.coursename.value
            const subject = evt.target.subject.value
            const category = evt.target.category.value
            // console.log('formName', formName)
            const courseObj = { title, subject, category }
            dispatch(createCourse(courseObj))
        },
    }
}

export const CreateNewCourse = connect(
    mapCreateCourse,
    mapDispatch
)(CreateCourse)
