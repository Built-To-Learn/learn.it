import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const socket = io();

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      currentMessage: '',
    };

    socket.on('newMessage', (message) => {
      this.setState({
        ...this.state,
        messages: [...this.state.messages, message],
      });
    });
  }

  componentDidMount () {
    document.getElementById("chat-text")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
        document.getElementById("chat-submit").click();
    }
});
  }

  handleChange(event) {
    const { userName } = this.props
    const message = event.target.value;
    this.setState({
      ...this.state,
      currentMessage: message,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { userName } = this.props;
    socket.emit('newMessage', `${userName}: ${this.state.currentMessage}`);
    this.setState({
      ...this.state,
      currentMessage: '',
    });
  }

  render() {
    const { messages, currentMessage } = this.state;

    return (
      <div id='chat'>
        <div id='chat-messages'>
          {messages.map((message, i) => {
            return <p key={i}>{message}</p>;
          })}
        </div>
        <div id='chat-input'>
          <input
            value={currentMessage}
            onChange={(event) => this.handleChange(event)}
            id='chat-text'
          ></input>
          <button type='submit' id='chat-submit' onClick={(event) => this.handleSubmit(event)}>Send</button>
          
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  userName: state.auth.username
})

export default connect(mapState)(Chat);
