import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import { createQuestion } from "../store/questions";
import { io } from 'socket.io-client';
import { Dropdown, Button } from 'react-materialize';

class AskQuestion extends Component {
    constructor (props) {
        super(props);

        this.input = ''

        this.state = { room: props.room }

        this.handleChange = this.handleChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (event) {
        const input = event.target.value;
        this.input = input
    }

    handleSubmit (event) {
        event.preventDefault();
        const socket = io();
        this.props.createQuestion({ userId: this.props.id, courseId: this.state.room, text: this.input }, true)
        this.input = ''
        this.setState({ ...this.state })
        socket.emit('newQuestion')
    }

    render () {
        return (
            <Dropdown
                id="Dropdown_6"
                options={{
                    alignment: 'left',
                    autoTrigger: true,
                    belowOrigin: false,
                    closeOnClick: false,
                    constrainWidth: true,
                    container: null,
                    coverTrigger: true,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                }}
                style={{height: '100px', zIndex: '1'}}
                trigger={<Button node="button" className='btn deep-orange accent-2' style={{bottom: '0'}}>Ask A Question</Button>}
            >
                <div className="ask-question-header deep-orange accent-2">
                    <h2>Enter Question</h2>
                </div>
                <form className="ask-question-body">
                    <input id='ask-question-input' className='ask-question-input' onChange={(event)=> this.handleChange(event)}></input>
                    <div className='ask-question-buttons'>
                        <button type='submit' className='btn deep-orange accent-2' onClick={(event) => this.handleSubmit(event)}>Submit</button>
                    </div>
                </form>
            </Dropdown>
        )
    }
}

const mapState = (state) => ({
    id: state.auth.id
})

const mapDispatch = (dispatch) => ({
    createQuestion: (question, createLocally) => dispatch(createQuestion(question, createLocally))
})

export default connect(mapState, mapDispatch)(AskQuestion);