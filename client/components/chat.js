import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { connect } from 'react-redux';

// const socket = io();

// socket.on('connect', () => {
//   console.log('new socket', socket.id);
// });

// window.onunload = window.onbeforeunload = () => {
//   socket.close();
// };

let socket;

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      currentMessage: '',
    };
  }

  componentDidMount() {
    document
      .getElementById('chat-text')
      .addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.key === 'Enter') {
          document.getElementById('chat-submit').click();
        }
      });

    console.log('this componet mounted');
    socket = io();

    socket.on('connect', () => {
      console.log('new socket', socket.id);
      socket.emit('joinChat', this.props.room);
    });

    socket.on('newMessage', (message) => {
      console.log(message);
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
        `${userName}:${this.state.currentMessage}`,
      ],
    });
  }

  componentDidUpdate() {
    setTimeout(() => {
      const chat = document.getElementById('chat-messages');
      chat.scrollTop = chat.scrollHeight;
    }, 100);
  }

  render() {
    const { messages, currentMessage } = this.state;

    return (
      <div id="chat">
        <div id="chat-messages">
          {messages.map((message, i) => {
            return <p key={i}>{message}</p>;
          })}
        </div>
        <div id="chat-input">
          <input
            value={currentMessage}
            onChange={(event) => this.handleChange(event)}
            id="chat-text"
          ></input>
          <button
            type="submit"
            id="chat-submit"
            onClick={(event) => this.handleSubmit(event)}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  userName: state.auth.username,
});

export default connect(mapState)(Chat);
