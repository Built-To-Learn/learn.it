
import React, { useState } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'

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
      // handle success
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <form onSubmit={submitFile}>
      <label>Upload file</label>
      <input type="file" onChange={event => setFile(event.target.files)} />
      <button type="submit">Send</button>
    </form>
  );
};

const mapState = state => ({
  title: state.singleCourse.title
})

export default connect(mapState)(ResourceUpload);