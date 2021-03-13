import React from 'react'
import { connect } from 'react-redux'
import { getPaypalLinks } from "../store"

class Payment extends React.Component{
  constructor(props){
    super(props)
  }

  async componentDidMount(){
    this.props.getLinks(this.props.auth.email, this.props.auth.id)
  }

  render(){
    const { links } = this.props.payment
    return (
      <div>
        <a target="_blank" className={!links ? "disabled btn" : "btn" }  href={!links ? "" : links[1].href}>
          Link Paypal
        </a>
      </div>
    )
  }
}

const mapState = ({payment, auth}) => {
  return {
      payment,
      auth
  }
}

const mapDispatch = (dispatch) => {
  return {
      getLinks(email, userid){
        dispatch(getPaypalLinks(email, userid))
      }
  }
}

export default connect(mapState, mapDispatch)(Payment)
