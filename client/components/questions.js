import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
  deleteQuestion,
  fetchQuestions,
  initQuestion,
  likeToggle,
  removeQuestion,
  toggleLike
} from '../store/questions';
import { io } from 'socket.io-client';
import { AskQuestion } from './index'

class Questions extends Component {
  constructor(props) {
    super(props);

    const socket = io();
    this.state = { socket: socket, room: props.room, teacher: props.teacher, type: props.type };
  }

  componentDidMount() {
    const { user } = this.props;
    const { socket } = this.state;

    this.props.init(this.state.room);
    this.setState({ ...this.state, isTeacher: user.id === this.state.teacher });

    socket.on('connect', () => {
      socket.emit('joinQuestions', this.state.room);
    });
    socket.on('newQuestion', (newQuestion) => {
        this.props.initQuestion(newQuestion)
    });
    socket.on('toggleLike', (question) => {
        this.props.likeToggle(question)
    });
    socket.on('deleteQuestion', (id) => {
        this.props.removeQuestion(id)
    })
  }

  componentDidUpdate() {
    const { questions, user } = this.props;
    const { id } = user;

    if (!this.state.likes) {
      const likes = {};

      questions.map((question) => {
        let liked = false;
        question.likes.map((like) => {
          if (like.userId === id) {
            liked = true;
          }
        });
        likes[question.id] = liked;
      });

      this.setState({ ...this.state, likes: likes });
    }
  }

  handleToggle(event) {
    const questionId = event.target.id.slice(8);
    const likes = { ...this.state.likes };

    this.props.toggleLike(
      questionId,
      this.props.user.id,
      this.state.likes[questionId],
      this.state.room,
      this.state.socket
    );

    likes[questionId] = !likes[questionId];

    this.setState({ ...this.state, likes: likes });
  }

  handleDelete(event) {
    const questionId = event.target.id.slice(6);

    this.props.deleteQuestion(questionId, this.state.socket, this.state.room);
  }

  render() {
    const { questions } = this.props;
    const { likes, isTeacher } = this.state;

    if (!likes) {
      return null;
    }

    return (
      <div id="questions-container">
        <div id="questions">
            {
                questions.length !== 0 ?
                questions.map((question, idx) => {
                    const style = likes[question.id] ? 'favorite' : 'favorite_border';
                    return (
                      <div key={question.id}>
                        <div id="question">
                          <small>{question.likes.length}</small>
                          <button id="question-like">
                            <i
                              className="material-icons icon-orange"
                              id={'question' + question.id}
                              onClick={(event) => this.handleToggle(event)}
                            >
                              {style}
                            </i>
                          </button>
                          <span>
                            {question.user.name}: {question.text}
                          </span>
                          {isTeacher ? (
                            <button
                              id={'button' + question.id}
                              className="remove-question btn red"
                              onClick={(event) => this.handleDelete(event)}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        {idx === questions.length - 1 ? null : <hr></hr>}
                      </div>
                    );
                  }) :
                <div>
                  <h5 style={{width: '100%', fontSize: '2.5rem', textAlign: 'center'}}>No Questions Yet</h5>
                </div>
            }

        </div>
        {this.state.type === 'watcher' ? (
            <AskQuestion socket={this.state.socket} room={this.state.room}/>
            ) : (
              ''
            )}
      </div>
    );
  }
}

const mapState = (state) => ({
  questions: state.questions.questions,
  user: state.auth
});

const mapDispatch = (dispatch) => ({
  init: (courseId) => dispatch(fetchQuestions(courseId)),
  toggleLike: (questionId, userId, isLiked, room, socket) =>
    dispatch(toggleLike(questionId, userId, isLiked, room, socket)),
  initQuestion: (question) => dispatch(initQuestion(question)),
  deleteQuestion: (questionId, socket, room) => dispatch(deleteQuestion(questionId, socket, room)),
  likeToggle: (question) => dispatch(likeToggle(question)),
  removeQuestion: (id) => dispatch(removeQuestion(id))
});

export default connect(mapState, mapDispatch)(Questions);
