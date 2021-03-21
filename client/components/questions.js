import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import { fetchQuestions, changeQuestion } from "../store/questions";


// Questions Component
class Questions extends Component {
    constructor () {
        super();

        this.state = { likes: null }
    }

    componentDidMount () {
        const { room, questions } = this.props;
        const likes = {}
        
        this.props.init(room);

        questions.map(question => {
            likes[question.id] = false
        })

        this.setState({ likes: likes })
    }

    handleToggle(event) {
        const id = event.target.id.slice(8)
        const likes = { ...this.state.likes }

        console.log(`changing id ${id} from ${likes[id]} to ${!likes[id]}`)

        this.props.changeQuestion(id, likes[id] ? 'decrement' : 'increment')

        likes[id] = likes[id] ? false: true

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
                                <small>{question.upvotes}</small>
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
    questions: state.questions.questions
})

const mapDispatch = (dispatch) => ({
    init: (courseId) => dispatch(fetchQuestions(courseId)),
    changeQuestion: (questionId, type) => dispatch(changeQuestion(questionId, type))
})

export default connect(mapState, mapDispatch)(Questions)