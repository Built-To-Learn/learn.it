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
              <h3>Checkout the Course Resources</h3>
              <ResourceUpload/>
              {resources.map((resource) => {
                return (
                    <div>
                        <a href= {`https://built-to-learn.s3.us-east-2.amazonaws.com/${resource.Key}`} >{resource.Key}</a>
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
        resources: state.resources
    }


}


const mapDispatch = (dispatch) => ({
    getResources: () => {
        dispatch(loadResources());
      },
    

})

export default connect(mapState, mapDispatch)(Resources)