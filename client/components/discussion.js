import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchAddDiscussion,
  fetchClearDiscussion,
  fetchDiscussion,
  fetchAddExternalDiscussion,
} from '../store/discussion';
import { io } from 'socket.io-client';
import {
  Button,
  Icon,
  Textarea,
  TextInput,
  CardPanel,
} from 'react-materialize';

let socket;

const month = new Array(12);
month[0] = 'January';
month[1] = 'February';
month[2] = 'March';
month[3] = 'April';
month[4] = 'May';
month[5] = 'June';
month[6] = 'July';
month[7] = 'August';
month[8] = 'September';
month[9] = 'October';
month[10] = 'November';
month[11] = 'December';

class Discussion extends Component {
  constructor(props) {
    super(props);
    this.state = { discussion_input: '' };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  componentDidMount() {
    socket = io();

    socket.on('connect', () => {
      socket.emit(
        'joinDiscussionRoom',
        `discussion-${this.props.discussion.course.id}`
      );
    });

    socket.on('discussionMessage', (message) => {
      this.props.fetchAddExternalDiscussion(message);
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.fetchAddDiscussion(
      {
        text: this.state.discussion_input,
        courseId: this.props.discussion.course.id,
      },
      socket
    );
    this.setState({ discussion_input: '' });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.discussion.course !== this.props.discussion.course) {
      this.props.fetchDiscussion(this.props.discussion.course);
      socket.emit(
        'leaveDiscussionRoom',
        `discussion-${prevProps.discussion.course.id}`
      );
      socket.emit(
        'joinDiscussionRoom',
        `discussion-${this.props.discussion.course.id}`
      );
    }

    setTimeout(() => {
      const chat = document.getElementById('discussion_text');
      chat.scrollTop = chat.scrollHeight;
    }, 100);

    // if (
    //   this.props.discussion.discussion.length >
    //   prevProps.discussion.discussion.length
    // ) {
    //   const oldIds = prevProps.discussion.discussion.map((el) => el.id);
    //   const newMessage = this.props.discussion.discussion.filter(
    //     (el) => !oldIds.includes(el.id)
    //   );
    //   if (newMessage.user.id === this.props.auth.id) {
    //     console.log('hit');
    //     socket.emit(
    //       'discussionMessage',
    //       `discussion-${this.props.discussion.course.id}`,
    //       newMessage
    //     );
    //   }
    // } else if (
    //   this.props.discussion.discussion.length <
    //   prevProps.discussion.discussion.length
    // ) {
    // } else {
    // }
  }

  componentWillUnmount() {
    socket.emit(
      'leaveDiscussionRoom',
      `discussion-${this.props.discussion.course.id}`
    );
    socket.close();
    this.props.fetchClearDiscussion();
  }

  render() {
    this.props.discussion.discussion.forEach((el) => {
      const temp = new Date(el.createdAt);
      let mins = temp.getMinutes();
      console.log(mins);
      if (mins.toString().length === 1) {
        mins = `0${mins.toString()}`;
      }
      const dateStr = `${
        month[temp.getMonth()]
      } ${temp.getDate()} ${temp.getFullYear()} ${temp.getHours()}:${mins}`;
      el.datestr = dateStr;
    });

    return (
      <div id="discussion">
        <div id="discussion_header">
          <CardPanel className="blue">
            <span className="white-text discussion_course_header">
              {this.props.discussion.course.title} Discussion Board
            </span>
          </CardPanel>
        </div>
        <div id="discussion_body">
          <div id="discussion_text">
            <ul>
              {this.props.discussion.discussion.map((post) => {
                return (
                  <li key={post.id}>
                    <CardPanel className="white discussion_post_body">
                      <div>
                        <span className="black-text post_username">
                          {post.user.name}
                        </span>
                        <span className="black-text post_date">
                          {post.datestr}
                        </span>
                      </div>
                      <div>
                        <span className="black-text post_text">
                          {post.text}
                        </span>
                      </div>
                    </CardPanel>
                  </li>
                );
              })}
            </ul>
          </div>
          <form id="discussion_post" onSubmit={(e) => this.onSubmit(e)}>
            <TextInput
              id="discussion_input"
              value={this.state.discussion_input}
              name="discussion_input"
              onChange={(e) => this.onChange(e)}
              placeholder="Create a discussion item"
              icon="comment"
            ></TextInput>
            <Button node="button" className="blue discussion_post_btn" small>
              Post
              <Icon right>keyboard_return</Icon>
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ discussion, auth }) => {
    return {
      discussion: discussion,
      auth: auth,
    };
  },
  (dispatch) => {
    return {
      fetchAddDiscussion: (discussion, socket) =>
        dispatch(fetchAddDiscussion(discussion, socket)),
      fetchDiscussion: (course) => dispatch(fetchDiscussion(course)),
      fetchAddExternalDiscussion: (discussion) =>
        dispatch(fetchAddExternalDiscussion(discussion)),
      fetchClearDiscussion: () => dispatch(fetchClearDiscussion()),
    };
  }
)(Discussion);
