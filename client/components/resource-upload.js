
import React, { useState } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'
import { loadResources } from '../store/resource'

const ResourceUpload = (props) => {  
  const [file, setFile] = useState(null);

  const submitFile = async (event) => {
    try {
      event.preventDefault()
      const title = props.title
      if (!file) {
        throw new Error('Select a file first!');
      }
      const formData = new FormData();
      formData.append('file', file[0]);
      await axios.post(`/api/resource/test-upload/${title}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      props.getResources(title)

      // handle success
    } catch (error) {
      console.log(error)
    }
  };

  return (

  //   <form onSubmit={submitFile}>
  //   <label>Upload file</label>
  //   <input type="file" onChange={event => setFile(event.target.files)} />
  //   <button type="submit">Send</button>
  // </form>
      // <form onSubmit={submitFile}>
      //   {/* <label>Upload file</label> */}
      //   {/* <div > */}
            
      //           {/* <span>Browse</span> */}
      //           {/* <input type = "file" /> */}
          
              
      //         {/* <div className = "file-path-wrapper"> */}
      //           <input type="file" onChange={event => setFile(event.target.files)} />
      //           {/* <input className = "file-path validate" type = "file"
      //               placeholder = "Upload file"  style={{marginLeft: '2rem', width : "30vw"}}/> */}
      //           <button className="btn" type="submit">Upload Resource</button>
      //         {/* </div> */}

      //     {/* </div> */}
      // </form>
      <form onSubmit={submitFile} id = "resource-upload">
      <div className="file-field input-field" >
        <div className="btn" id="upload-btn" >
          <span>File</span>
          <input id = "resource-upload" type="file" onChange={event => setFile(event.target.files)} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text"/>
        </div>
      </div>
        <button className ='btn' id="upload-btn" type="submit">Send</button>
    </form>

      
      
  );
};

const mapState = state => ({
  title: state.singleCourse.title
})

const mapDispatch = (dispatch) => ({
  getResources: (courseTitle) => {
    dispatch(loadResources(courseTitle));
  },
})

export default connect(mapState, mapDispatch)(ResourceUpload);