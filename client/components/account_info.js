import React, {useEffect} from "react"
import {StripeOnboard, Earnings} from '../components'
import { connect } from "react-redux"
import { updateUserInfo } from "../store"
import ResourceUpload from './resource-upload'
import { loadProfilePic } from "../store/profile-pics"
import { useSelector } from 'react-redux'

const AccountInfo = ({auth, handleSubmit,getProfilePic,pictures}) => {

 useEffect (()=> {
     getProfilePic(auth.username)
  },[])

 
  let picURL = "/assets/default.jpeg"
  if (pictures.length >= 1){
    picURL = `https://built-to-learn-profile-pics.s3.us-east-2.amazonaws.com/${pictures[pictures.length-1].Key}`
  }
    

  return (
      <div className="section container">
        <h1 className="center-align grey-text text-lighten-3">Account Info</h1>
        <form style={{width: "50%"}} className="row" onSubmit={(evt) => handleSubmit(auth, evt)}>

          <div className="col s12 center">
            {auth.onboarded && <Earnings />}
          </div>

          <div className="col s12">
              <label htmlFor="fullname">
                  <small>Full Name</small>
              </label>
              <input className="white-text" name="fullname" type="text" defaultValue={auth.name} />
          </div>

          <div className="col s12">
              <label htmlFor="username">
                  <small>username</small>
              </label>
              <input className="white-text" name="username" type="text" defaultValue={auth.username} />
          </div>

          <div className="col s12">
              <label htmlFor="email">
                  <small>Email</small>
              </label>
              <input className="white-text" name="email" type="text" defaultValue={auth.email} />
          </div>

          <div className="col s12 center">
            <StripeOnboard />
            <button className="btn deep-orange accent-2" type="submit">Save</button>
          </div>

        </form>
        <div className="col s12 center">
          <ResourceUpload  isProfilePic = {true}/>
        </div>
        <div className = 'avatar-div'>
          {pictures.length >= 1 ? <img className='avatar-pic' src = {picURL}></img> : <img className='avatar-pic' src = '/assets/default.jpeg'></img>}
        </div>
        
      </div>

  )
}

const mapState = ({auth, payment, pictures}) => {
  return {
    auth,
    pictures
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(auth, evt){
      evt.preventDefault()
      const username = evt.target.username.value
      const name = evt.target.fullname.value
      const email = evt.target.email.value
      const id = auth.id
      dispatch(updateUserInfo(id, {username, name, email}))
    },

    getProfilePic(username){
      dispatch(loadProfilePic(username))
    }
  }
}
export default connect(mapState, mapDispatch)(AccountInfo)
