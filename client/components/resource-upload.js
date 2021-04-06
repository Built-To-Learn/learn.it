
import React, { useState } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'
import { loadResources } from '../store/resource'
import { loadProfilePic } from '../store/profile-pics'

const ResourceUpload = (props) => {


  const [file, setFile] = useState(null);

  const submitFile = async (event) => {
    try {
      event.preventDefault()
      const userName = props.username

      if (!file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      formData.append('file', file[0]);

      if (props.isProfilePic === true){
        await axios.post(`/api/resource/profile-pic/${userName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        props.getProfilePic(userName)
      } else{ // just a regular file upload
        const title = props.title
        await axios.post(`/api/resource/test-upload/${title}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        props.getResources(title)
      }


      // handle success
    } catch (error) {
      console.log(error)
    }
  };

  return (

        <form onSubmit={submitFile} id = "resource-upload">
          <div className="file-field input-field" >
            <div className="btn deep-orange deep-orange accent-1" id="upload-btn" >
              <span>File</span>
              <input id = "resource-upload" type="file" onChange={event => setFile(event.target.files)} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text"/>
            </div>
          </div>
          <button className ='btn deep-orange deep-orange accent-2' id="upload-btn" type="submit">Send</button>
        </form>



  );
};

const mapState = state => ({
  title: state.singleCourse.title,
  username: state.auth.username

})


const mapDispatch = (dispatch) => ({
  getResources: (courseTitle) => {
    dispatch(loadResources(courseTitle));
  },
  getProfilePic: (userName) => {
    dispatch(loadProfilePic(userName));
  },
})

export default connect(mapState, mapDispatch)(ResourceUpload);
