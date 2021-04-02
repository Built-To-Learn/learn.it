import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCourse } from '../store/courses';
import Parallax from './parallax.js';
import Icons from './icons.js';
import { Button, Icon } from 'react-materialize';
import { fetchClearView } from '../store/view';
import { fetchView } from '../store/view';
import { loadSingleCourse } from '../store/single-course';
/**
 * COMPONENT
 */
class CreateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = { coursename: '', category: '', description: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmitForm(e) {
    e.preventDefault();
    const event = e;
    this.props.handleSubmit(event);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.courses.length < this.props.courses.length) {
      try {
        const prevCourseMap = prevProps.courses.map((el) => el.id);
        const course = this.props.courses.filter(
          (el) => !prevCourseMap.includes(el.id)
        )[0];
        this.props.fetchView('viewSingleCourse');
        this.props.loadSingleCourse(course);
      } catch (ex) {
        console.log('cannot create');
      }
    }
  }

  render() {
    const { error, isLoggedIn } = this.props;
    return (
      <div>
        <h2 className="center-align grey-text text-lighten-3">Create A Course</h2>
        {isLoggedIn ? (
          <div id="create_a_class_div">
            <form
              id="create_a_class_form"
              onSubmit={(e) => this.handleSubmitForm(e)}
            >
              <div>
                <label className="create_course_labels" htmlFor="coursename">
                  Course Name
                </label>
                <input
                  name="coursename"
                  className="white-text"
                  value={this.state.coursename}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div>
                <label className="create_course_labels" htmlFor="Category">
                  Category
                </label>
                <input
                  className="white-text"
                  name="category"
                  value={this.state.category}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div>
                <label
                  className="create_course_labels"
                  htmlFor="Course Description"
                >
                  Description
                </label>
                <textarea
                  className="white-text"
                  id="create_course_text_area"
                  name="description"
                  value={this.state.description}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>

              <Button
                id="create_class_btn"
                node="button"
                className="grey darken-3"
                type="submit"
              >
                Create Course
                <Icon left>add</Icon>
              </Button>
              {error && error.response && <div> {error.response.data} </div>}
            </form>
            {/* <a href="/viewcourses">link text</a> */}
          </div>
        ) : (
          <p>Must Be Logged In to Create a Class</p>
        )}
      </div>
    );
  }
}

const mapCreateCourse = ({ auth, courses }) => {
  return {
    isLoggedIn: !!auth.id,
    courses: courses.user,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      //evt.preventDefault();
      // const formName = evt.target.name
      const title = evt.target.coursename.value;
      // const subject = evt.target.subject.value
      const category = evt.target.category.value;
      // console.log('formName', formName)
      const courseObj = { title, category };
      dispatch(createCourse(courseObj));
    },
    fetchClearView: () => dispatch(fetchClearView()),
    fetchView: (view) => dispatch(fetchView(view)),

    loadSingleCourse: (course) => dispatch(loadSingleCourse(course)),
  };
};

export const CreateNewCourse = connect(
  mapCreateCourse,
  mapDispatch
)(CreateCourse);
