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
        {isLoggedIn ? (
          <div>
            <form onSubmit={(e) => this.handleSubmitForm(e)}>
              <div>
                <label htmlFor="coursename">
                  <small>Course Name</small>
                </label>
                <input
                  name="coursename"
                  value={this.state.coursename}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div>
                <label htmlFor="Category">
                  <small>Category</small>
                </label>
                <input
                  name="category"
                  value={this.state.category}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div>
                <label htmlFor="Course Description">
                  <small>Description</small>
                </label>
                <input
                  name="description"
                  value={this.state.description}
                  type="text"
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div>
                <Button node="button" className="blue" small type="submit">
                  Create Course
                  <Icon left>add</Icon>
                </Button>
              </div>
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
