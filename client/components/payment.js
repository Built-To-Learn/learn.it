import React from 'react'
import { connect } from 'react-redux'
import { getPaypalLinks } from "../store"

class Payment extends React.Component{
  constructor(props){
    super(props)
  }

  async componentDidMount(){
    this.props.getLinks()
  }

  render(){
    const {links} = this.props.payment
    console.log(links)
    return (
      <div>
        <a target="_blank" className={!links ? "disabled btn" : "btn" }  href={!links ? "" : links[1].href}>
          Link Paypal
        </a>
      </div>
    )
  }
}

const mapState = ({payment}) => {
  return {
      payment
  }
}

const mapDispatch = (dispatch) => {
  return {
      getLinks(){
        dispatch(getPaypalLinks())
      }
  }
}

export default connect(mapState, mapDispatch)(Payment)
