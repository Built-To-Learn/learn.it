import React from 'react'
import M from 'materialize-css'

export const CourseCard = ({ course }) => {
    console.log(course)
    return (
        // <div key={idx}>
        //     <p>{course.title}</p>
        // </div>
        <div className="row">
            <div className="col s13 m3">
                <div className="card hoverable">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="activator" src="assets/elearning.png" />
                    </div>
                    <div className="card-content">
                        <span className="card-title activator grey-text text-darken-4">
                            {course.title}
                            <i className="material-icons right">more_vert</i>
                        </span>
                        <p>
                            <a href="#">Enroll</a>
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
