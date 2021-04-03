import React from "react";
import { Component } from 'react';
import { connect } from "react-redux";
import ResourceUpload from './resource-upload'
import { loadResources } from '../store/resource'


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
          const {resources, singleCourse} = this.props;
          const courseTitle = singleCourse.title


          return( <div className="">
              <h3 className="center">{courseTitle} Resources</h3>
              <ResourceUpload isProfilePic = {false}/>
              <ul className="collection container">
                {resources.map((resource,idx) => {
                    const resourceTitle = this.getSecondPart(resource.Key)
                    return (
                        <li className="collection-item"  key = {idx}>
                            <a target="_blank" key={resource.ETag} href= {`https://built-to-learn.s3.us-east-2.amazonaws.com/${resource.Key}`} >{resourceTitle}</a>
                        </li>
                    );
                })}
            </ul>

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
