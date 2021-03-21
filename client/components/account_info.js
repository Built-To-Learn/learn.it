import React from "react"
import StripeOnboard from './onboard_stripe'
import { connect } from "react-redux"
import { updateUserInfo } from "../store"

const AccountInfo = ({auth, handleSubmit, payment}) => {
  return (
      <div className="section container">
        <h1 className="center-align">Account Info</h1>
        <form style={{width: "50%"}} className="row" onSubmit={(evt) => handleSubmit(auth, evt)}>
          <div className="col s12">
              <label htmlFor="fullname">
                  <small>Full Name</small>
              </label>
              <input name="fullname" type="text" defaultValue={auth.name} />
          </div>

          <div className="col s12">
              <label htmlFor="username">
                  <small>username</small>
              </label>
              <input name="username" type="text" defaultValue={auth.username} />
          </div>

          <div className="col s12">
              <label htmlFor="email">
                  <small>Email</small>
              </label>
              <input name="email" type="text" defaultValue={auth.email} />
          </div>

          <div className="col s12 center">
            <StripeOnboard />
            <button className="btn" type="submit">Save</button>
          </div>
          <p className="red-text">
          </p>
        </form>
      </div>
  )
}

const mapState = ({auth, payment}) => {
  return {
    auth,
    payment
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
    }
  }
}
export default connect(mapState, mapDispatch)(AccountInfo)
