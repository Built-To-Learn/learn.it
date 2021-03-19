import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";

class Questions extends Component {
    handleToggle(event) {
        const icon = document.getElementById(event.target.id)
        const status = icon.innerHTML
        icon.innerHTML = (status === 'favorite' ? 'favorite_border':'favorite')
    }

    render () {
        const { questions } = this.props;

        return (
            <div>
                { questions.map( question => {
                    return (
                        <div>
                            <button id='question-like'><i className='material-icons' id={'question' + question.id} onClick={(event) => this.handleToggle(event)}>favorite_border</i></button>
                            <small>{question.upvotes}</small>
                            <span>{question.user}: {question.text}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
}

const mapState = (state) => ({
    questions: state.questions.questions
})

export default connect(mapState)(Questions)