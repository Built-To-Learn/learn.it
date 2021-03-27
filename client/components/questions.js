import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import { createQuestion, fetchQuestions, toggleLike } from "../store/questions";
import { io } from 'socket.io-client';

class Questions extends Component {
    constructor () {
        super();

        const socket = io();

        this.state = { socket: socket }
    }

    componentDidMount () {
        const { room, questions, id } = this.props;
        const { socket } = this.state;
        const likes = {}
        
        this.props.init(room);

        questions.map(question => {
            let liked = false
            question.likes.map(like => {
                if (like.userId === id) { liked = true }
            })
            likes[question.id] = liked 
        })

        this.setState({ ...this.state, likes: likes })

        socket.on('connect', () => {
            socket.emit('joinQuestions', room);
          });
        socket.on('newQuestion', (newQuestion) => {
            this.props.createQuestion(newQuestion, false)
        });
    }

    componentDidUpdate () {
        const { socket } = this.state;
        const { newQuestion, id, room } = this.props;
        if (newQuestion) {
            if (newQuestion.userId === id) { socket.emit('newQuestion', room, newQuestion) }
        }
    }

    handleToggle(event) {
        const id = event.target.id.slice(8)
        const likes = { ...this.state.likes }

        this.props.toggleLike(id, this.props.id, this.state.likes[id])

        likes[id] = !likes[id]

        this.setState({ ...this.state, likes: likes })
    }

    render () {
        const { questions } = this.props;
        const { likes } = this.state;

        if (!likes) { return null }

        return (
            <div id='questions-container'>
                <div id='questions'>
                { questions.map( (question, idx) => {
                    const style = likes[question.id] ? 'favorite' : 'favorite_border'
                    return (
                        <div key={question.id}>
                            <div id='question'>
                                <small>{question.likes.length}</small>
                                <button id='question-like'><i className='material-icons' id={'question' + question.id} onClick={(event) => this.handleToggle(event)}>{style}</i></button>
                                <span>{question.user.name}: {question.text}</span>
                            </div>
                            {idx === questions.length - 1 ? null : <hr></hr>}
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }
}

const mapState = (state) => ({
    questions: state.questions.questions,
    newQuestion: state.questions.newQuestion,
    id: state.auth.id
})

const mapDispatch = (dispatch) => ({
    init: (courseId) => dispatch(fetchQuestions(courseId)),
    toggleLike: (questionId, userId, isLiked) => dispatch(toggleLike(questionId, userId, isLiked)),
    createQuestion: (question, createLocally) => dispatch(createQuestion(question, createLocally))
})

export default connect(mapState, mapDispatch)(Questions)