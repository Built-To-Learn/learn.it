import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-materialize';

let socket;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: '',
      type: props.type,
    };
    this.keyup = this.keyup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  keyup(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
      document.getElementById('chat-submit').click();
    }
  }

  componentDidMount() {
    const el = document.getElementById('chat-text');
    el.addEventListener('keyup', this.keyup);

    socket = io();

    socket.on('connect', () => {
      socket.emit('joinChat', this.props.room);
    });

    socket.on('newMessage', (message) => {
      this.setState({
        ...this.state,
        messages: [...this.state.messages, message],
      });
    });
  }

  handleChange(event) {
    const message = event.target.value;
    this.setState({
      ...this.state,
      currentMessage: message,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { userName } = this.props;
    socket.emit(
      'newMessage',
      `${userName}: ${this.state.currentMessage}`,
      this.props.room
    );
    this.setState({
      ...this.state,
      currentMessage: '',
      messages: [
        ...this.state.messages,
        `${userName}: ${this.state.currentMessage}`,
      ],
    });
  }

  componentDidUpdate() {
    setTimeout(() => {
      const chat = document.getElementById('chat-messages');
      chat.scrollTop = chat.scrollHeight;
    }, 100);
  }

  componentWillUnmount() {
    socket.close();
    const el = document.getElementById('chat-text');
    el.removeEventListener('keyup', this.keyup);
  }

  render() {
    const { messages, currentMessage } = this.state;
    return (
      <div id="chat">
        <div id="chat-messages">
          {messages.map((message, i) => {
            return (
              <p className="white-text" key={i}>
                {message}
              </p>
            );
          })}
        </div>
        <div id="chat-input">
          <input
            className="white-text"
            value={currentMessage}
            onChange={(event) => this.handleChange(event)}
            id="chat-text"
          ></input>
          <div id="chat-interactions" className="valign-wrapper">
            <button
              className="btn-small deep-orange accent-2"
              type="submit"
              id="chat-submit"
              onClick={(event) => this.handleSubmit(event)}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  userName: state.auth.username,
});

export default connect(mapState)(Chat);
