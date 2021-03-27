import React, { Component } from 'react';
import { connect } from 'react-redux';
import discussion, {
  fetchAddDiscussion,
  fetchClearDiscussion,
  fetchDiscussion,
  fetchAddExternalDiscussion,
} from '../store/discussion';
import { io } from 'socket.io-client';

let socket;

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
  }

  render() {
    return (
      <div id="discussion">
        <div id="discussion_header">{this.props.discussion.course.title}</div>
        <div id="discussion_body">
          <div id="discussion_text">
            <ul>
              {this.props.discussion.discussion.map((post) => {
                return <li key={post.id}>{post.text}</li>;
              })}
            </ul>
          </div>
          <form id="discussion_post" onSubmit={(e) => this.onSubmit(e)}>
            <input
              id="discussion_input"
              value={this.state.discussion_input}
              name="discussion_input"
              onChange={(e) => this.onChange(e)}
            ></input>
            <button>Submit</button>
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
    };
  }
)(Discussion);
