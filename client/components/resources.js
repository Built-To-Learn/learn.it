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


    render() {
        console.log("PROPS",this.props)
        const {resources} = this.props
        console.log("COMPONENT RESOURCES", resources)
        
        if (this.props.resources.length !== 0) {
          const {resources} = this.props;

          return( <div>
              <ResourceUpload/>
              {resources.map((resource) => {
                return (
                    <p key= {resource.ETag} >{resource.Key}</p>
                );
              })}

          </div> 
          )
     
        } else {
          return <div>No Resources</div>;
        }
      }

}

const mapState = (state) => {
    return{
        resources: state.resources
    }


}


const mapDispatch = (dispatch) => ({
    getResources: () => {
        dispatch(loadResources());
      },
    

})

export default connect(mapState, mapDispatch)(Resources)