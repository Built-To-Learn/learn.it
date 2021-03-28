import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import { createQuestion } from "../store/questions";
import { io } from 'socket.io-client';

class Modal extends Component {
    constructor () {
        super();

        this.state = { input: '' }

        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose (event) {
        event.preventDefault()
        const modal = document.getElementById('modal')
        modal.style.display = 'none'
        this.setState({ input: '' })
        document.getElementById('modal-input').value = ''
    }

    handleChange (event) {
        const input = event.target.value;
        this.setState({ input: input })
    }

    handleSubmit (event) {
        const socket = io();
        event.preventDefault();
        this.handleClose(event);
        this.props.createQuestion({ userId: this.props.id, courseId: this.props.room, text: this.state.input }, true)
        socket.emit('newQuestion')
    }

    render () {
        return (
            <div id='modal' className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Enter Question</h2>
                    </div>
                    <form className="modal-body">
                        <input id='modal-input' className='modal-input' onChange={(event)=> this.handleChange(event)}></input>
                        <div className='modal-buttons'>
                            <button type='submit' className='btn blue' onClick={(event) => this.handleSubmit(event)}>Submit</button>
                            <button className='btn red' onClick={(event) => this.handleClose(event)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapState = (state) => ({
    id: state.auth.id
})

const mapDispatch = (dispatch) => ({
    createQuestion: (question, createLocally) => dispatch(createQuestion(question, createLocally))
})

export default connect(mapState, mapDispatch)(Modal);