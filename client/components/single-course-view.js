//switch view, and pass down id to getSingleCourseViewRoute
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import M from 'materialize-css';
import CourseCard from './course-card';
import singleCourse from '../store/single-course';
import {
  CardPanel,
  Row,
  Col,
  Parallax,
  Slider,
  Slide,
  Caption,
} from 'react-materialize';

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

class SingleCourseView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
    this.handleSelect = this.handleSelect.bind(this);
    this.editCalendar = this.editCalendar.bind(this);
  }
  async componentDidMount() {
    const events = this.props.singleCourse.schedules.map((schedule) => {
      return {
        ...schedule,
        start: new Date(schedule.start),
        end: new Date(schedule.end),
        title: this.props.singleCourse.title,
      };
    });

    this.setState({ events: events });
  }

  async editCalendar(e) {
    const token = await window.localStorage.getItem('token');

    if (token) {
      axios.post(
        '/api/schedule/deleteEvent',
        {
          id: e.id,
          courseId: e.courseId,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      this.setState({
        events: this.state.events.filter((el) => el.id !== e.id),
      });
    }
  }

  async handleSelect({ start, end }) {
    // const startDate = start;
    // const endDate = end;
    const token = await window.localStorage.getItem('token');

    if (token) {
      const event = (
        await axios.post(
          '/api/schedule/createEvent',
          {
            course: this.props.singleCourse,
            schedule: { start: start, end: end },
          },
          {
            headers: {
              authorization: token,
            },
          }
        )
      ).data;
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      event.title = this.props.singleCourse.title;
      this.setState({
        events: [...this.state.events, event],
      });
    }
  }

  render() {
    const singleCourse = this.props.singleCourse;
    return (
      <div id="single_course_view">
        <div id="single_course_content">
          <Slider
            fullscreen={false}
            options={{
              duration: 500,
              height: 175,
              indicators: true,
              interval: 6000,
            }}
          >
            <Slide
              image={
                <img
                  alt=""
                  id="single_course_image"
                  src="http://lorempixel.com/780/580/nature/1"
                />
              }
            >
              <Caption placement="left">
                <h4>{singleCourse.title}!</h4>
                <h6 className="light grey-text text-lighten-3">
                  Here's our small slogan.
                </h6>
              </Caption>
            </Slide>
            <Slide
              image={
                <img
                  alt=""
                  src="http://lorempixel.com/780/580/nature/2"
                  //   height="50px"
                  //   width="50px"
                />
              }
            >
              <Caption placement="left">
                <h5 className="light grey-text text-lighten-3">
                  {singleCourse.description}
                </h5>
              </Caption>
            </Slide>
          </Slider>
          <Row>
            <Col m={12} s={12}>
              <CardPanel className="teal">
                <span className="white-text">
                  Description: {singleCourse.description}
                </span>
              </CardPanel>
            </Col>
          </Row>
          <img
            style={{ height: '50px', width: '50px' }}
            src="/assets/default.jpeg"
          ></img>
          <p>Course Creator: {singleCourse.user.name}</p>
          <p>Category: {singleCourse.category}</p>
        </div>
        <div id="calendar_div">
          {this.props.auth.id === this.props.singleCourse.user.id ? (
            <Calendar
              selectable
              id="calendar"
              localizer={localizer}
              events={this.state.events}
              defaultView={Views.WEEK}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(e) => this.editCalendar(e)}
              onSelectSlot={(e) => this.handleSelect(e)}
            />
          ) : (
            <Calendar
              id="calendar"
              localizer={localizer}
              events={this.state.events}
              defaultView={Views.WEEK}
              startAccessor="start"
              endAccessor="end"
              // onSelectEvent={(e) => this.editCalendar(e)}
              // onSelectSlot={(e) => this.handleSelect(e)}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    courses: state.courses,
    singleCourse: state.singleCourse,
    auth: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default connect(mapState, mapDispatch)(SingleCourseView);
