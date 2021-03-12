import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { CourseCard } from './course-card';

class ClassSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', results: [] };
    this.addClass = this.addClass.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  addClass(e) {
    const selectedClass = this.state.results.find(
      (el) => el.id.toString() === e.target.id
    );
    console.log(selectedClass);
  }
  async onChange(e) {
    const text = e.target.value;
    const res = (await axios.get(`/api/courses/${text}`)).data;
    this.setState({ text: text, results: res });
  }

  render() {
    return (
      <div>
        <textarea
          value={this.state.text}
          onChange={(e) => this.onChange(e)}
        ></textarea>
        <ul>
          {this.state.results.map((course, idx) => {
            return (
              <CourseCard className="course_list" course={course} key={idx} />
              // <li
              //   id={result.id}
              //   key={result.id}
              //   onClick={(e) => this.addClass(e)}
              // >
              //   {result.title}
              // </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({ view }) => {
  return {
    view: view,
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatch)(ClassSearch);
