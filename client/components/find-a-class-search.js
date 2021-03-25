import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import CourseCard from './course-card';
import { TextInput, Icon } from 'react-materialize';

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
    console.log(text);
    let res;
    if (text.length > 0) {
      res = (await axios.get(`/api/courses/courseSearch/${text}`)).data;
    } else {
      res = [];
    }

    this.setState({ text: text, results: res });
  }

  render() {
    return (
      <div>
        <div id="search_for_class">
          <TextInput
            icon={<Icon>search</Icon>}
            value={this.state.text}
            onChange={(e) => this.onChange(e)}
            placeholder="Search for a class"
          ></TextInput>
        </div>
        <div>
          <ul id="find_a_class_course_list">
            {this.state.results.map((course, idx) => {
              return (
                <CourseCard className="course_list" course={course} key={idx} />
              );
            })}
          </ul>
        </div>
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
