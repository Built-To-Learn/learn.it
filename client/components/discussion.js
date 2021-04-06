import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchAddDiscussion,
  fetchClearDiscussion,
  fetchDiscussion,
  fetchAddExternalDiscussion,
  fetchEditDiscussion,
  fetchEditExternalDiscussion,
  fetchDeleteDiscussion,
  fetchDeleteExternalDiscussion,
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
    this.state = {
      discussion_input: '',
      posts: [...this.props.discussion.discussion],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.edit = this.edit.bind(this);
    this.onPostChange = this.onPostChange.bind(this);
    this.submitEdits = this.submitEdits.bind(this);
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

    socket.on('discussionMessageEdit', (message) => {
      this.props.fetchEditExternalDiscussion(message);
    });

    socket.on('deleteDiscussionMessage', (id) => {
      this.props.fetchDeleteExternalDiscussion(id);
    });
  }

  onPostChange(e) {
    try {
      const _post = this.state.posts.filter(
        (el) => el.id === parseInt(e.target.id.split('_')[1])
      )[0];

      this.setState({
        posts: this.state.posts.map((post) =>
          post.id === _post.id ? { ...post, text: e.target.value } : post
        ),
      });
    } catch (er) {
      console.log(er);
    }
  }

  async submitEdits(e) {
    try {
      const tar = e.target.id.split('_')[2];
      const post = this.state.posts.filter((el) => el.id === parseInt(tar))[0];

      await this.props.fetchEditDiscussion(post, socket);

      const check = document.getElementById(`submit_comment_${tar}`);
      check.classList.add('hidden_class');
      const el = document.getElementById(`post_${tar}`);
      el.readOnly = true;
      el.style.border = '0px solid gray';
    } catch (ex) {
      console.log(ex);
    }
  }

  edit(e) {
    try {
      const tar = e.target.id.split('_')[2];
      const el = document.getElementById(`post_${tar}`);
      el.readOnly = false;
      el.style.border = '1px solid gray';
      el.style.borderRadius = '5px';

      const check = document.getElementById(`submit_comment_${tar}`);
      check.classList.remove('hidden_class');
    } catch (er) {
      console.log(er);
    }
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

  componentDidUpdate(prevProps, prevState) {
    const len1 = this.state.posts.length;
    const len2 = this.props.discussion.discussion.length;
    let check = [];
    if (len1 === len2) {
      check = prevProps.discussion.discussion.filter(
        (el, idx) => el.text !== this.props.discussion.discussion[idx].text
      );
    }

    if (len1 !== len2 || check.length > 0) {
      this.setState({ posts: [...this.props.discussion.discussion] });
    }

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
          <CardPanel className="deep-orange accent-2">
            <span className="white-text discussion_course_header">
              {this.props.discussion.course.title} Discussion Board
            </span>
          </CardPanel>
        </div>
        <div id="discussion_body">
          <div id="discussion_text">
            <ul>
              {this.state.posts.map((post) => {
                return (
                  <li key={post.id}>
                    <CardPanel className="white discussion_post_body">
                      <div className="discussion_post_body_div">
                        <div>
                          <span className="black-text post_username">
                            {post.user.name}
                          </span>
                          <span className="black-text post_date">
                            {post.datestr}
                          </span>
                        </div>
                        <div>
                          {this.props.auth.id === post.user.id ? (
                            <img
                              className="crud_button edit_button"
                              id={`edit_comment_${post.id}`}
                              src="/assets/edit.png"
                              onClick={(e) => this.edit(e)}
                            />
                          ) : (
                            ''
                          )}
                          {this.props.auth.id === post.user.id ? (
                            <img
                              className="crud_button delete_button"
                              id={`delete_comment_${post.id}`}
                              src="/assets/delete.png"
                              onClick={() =>
                                this.props.fetchDeleteDiscussion(post, socket)
                              }
                            />
                          ) : (
                            ''
                          )}
                          {this.props.auth.id === post.user.id ? (
                            <img
                              className="crud_button submit_button hidden_class"
                              id={`submit_comment_${post.id}`}
                              src="/assets/checkmark.png"
                              onClick={(e) => this.submitEdits(e)}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                      <div>
                        <textarea
                          id={`post_${post.id}`}
                          readOnly
                          className="black-text post_text"
                          value={post.text}
                          onChange={(e) => this.onPostChange(e)}
                        ></textarea>
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
            <Button node="button" className="deep-orange accent-1 discussion_post_btn" small>
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
      fetchEditDiscussion: (discussion, socket) =>
        dispatch(fetchEditDiscussion(discussion, socket)),
      fetchEditExternalDiscussion: (discussion) =>
        dispatch(fetchEditExternalDiscussion(discussion)),
      fetchDeleteDiscussion: (discussion) =>
        dispatch(fetchDeleteDiscussion(discussion, socket)),
      fetchDeleteExternalDiscussion: (id) =>
        dispatch(fetchDeleteExternalDiscussion(id)),
    };
  }
)(Discussion);
