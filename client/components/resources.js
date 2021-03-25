import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import ResourceUpload from './resource-upload'
import { loadResources } from '../store/resource'


// Questions Component
class Resources extends Component {
    constructor () {
        super();
    }

    componentDidMount () {
        this.props.getResources();
    }



    render () {


        return (
            <div id='questions-container'>
                <ResourceUpload/>
                
            </div>
        )
    }
}

const mapState = (state) => ({

})

const mapDispatch = (dispatch) => ({
    getResources: () => {
        dispatch(loadResources());
      },
    

})

export default connect(mapState, mapDispatch)(Resources)