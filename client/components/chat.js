import { io } from 'socket.io-client';
import React, { Component } from 'react';
import {connect} from 'react-redux'

const socket = io();

window.onunload = window.onbeforeunload = () => {
    socket.close();
  };

class Chat extends Component {
    constructor () {
        super();
        this.state = {
            messages: [],
            currentMessage: ''
        }

        socket.on('newMessage', (message) => {
            this.setState({
                ...this.state,
                messages: [
                    ...this.state.messages,
                    message
                ]
            })
        })
    }

    handleChange(event) {
        const message = event.target.value
        this.setState({
            ...this.state,
            currentMessage: message
        })
    }

    handleSubmit (event) {
        event.preventDefault();
        socket.emit('newMessage', this.state.currentMessage)
        this.setState({
            ...this.state,
            currentMessage: ''
        })
    }

    render () {
        const { messages, currentMessage } = this.state;
        const { userName } = this.props;

        console.log(userName)

        return (
            <div>
                { messages.map( message => {
                    return (
                        <p>{ message }</p>
                    )
                })}
                <input value={ currentMessage }onChange={ (event) => this.handleChange(event) }></input>
                <button onClick={ (event) => this.handleSubmit(event) }></button>
            </div>
        )
    }
}

export default Chat;