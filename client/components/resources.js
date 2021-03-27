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
        this.props.getResources(this.props.singleCourse.title);
    }

    getSecondPart(str) {
        return str.split('/')[1];
    }


    render() {

        if (this.props.resources.length !== 0) {
          const {resources} = this.props;

          return( <div>
              <h3>Checkout the Course Resources</h3>
              <ResourceUpload/>
              {resources.map((resource,idx) => {
                const resourceTitle = this.getSecondPart(resource.Key)        
                return (
                    <div key = {idx}>
                        <a key= {resource.ETag}href= {`https://built-to-learn.s3.us-east-2.amazonaws.com/${resource.Key}`} >{resourceTitle}</a>
                    </div>
                );
              })}

          </div> 
          )
     
        } else {
          return <ResourceUpload/>
        }
      }

}

const mapState = (state) => {
    return{
        resources: state.resources,
        singleCourse: state.singleCourse
    }

}


const mapDispatch = (dispatch) => ({
    getResources: (courseTitle) => {
        dispatch(loadResources(courseTitle));
      },
    

})

export default connect(mapState, mapDispatch)(Resources)