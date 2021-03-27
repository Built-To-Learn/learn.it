import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import { fetchQuestions, toggleLike } from "../store/questions";

class Questions extends Component {
    constructor () {
        super();

        this.state = {}
    }

    componentDidMount () {
        const { room, questions, id } = this.props;
        const likes = {}
        
        this.props.init(room);

        questions.map(question => {
            const liked = false
            question.likes.map(like => {
                if (like.userId === id) { liked = true }
            })
            likes[question.id] = liked 
        })

        this.setState({ likes: likes })
    }

    handleToggle(event) {
        const id = event.target.id.slice(8)
        const likes = { ...this.state.likes }

        this.props.toggleLike(id, this.props.id, this.state.likes[id])

        likes[id] = !likes[id]

        this.setState({ likes: likes })
    }

    render () {
        const { questions } = this.props;
        const { likes } = this.state;

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
    id: state.auth.id
})

const mapDispatch = (dispatch) => ({
    init: (courseId) => dispatch(fetchQuestions(courseId)),
    toggleLike: (questionId, userId, isLiked) => dispatch(toggleLike(questionId, userId, isLiked))
})

export default connect(mapState, mapDispatch)(Questions)