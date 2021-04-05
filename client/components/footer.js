import React, {useEffect} from "react"
import { connect } from "react-redux"

const Footer = () => {
  return (
    <footer class="page-footer grey darken-3">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text"  >Built to Learn</h5>
          <h6><a class="grey-text text-lighten-3" href="https://github.com/Built-To-Learn/learn.it">Github Repo: Built to Learn</a></h6>
        </div>
        <div class="col l4 offset-l2 s12">
          <h5 class="white-text">Learn More About the Team</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="https://www.linkedin.com/in/vkuperavage/">Vince Kuperavage</a></li>
            <li><a class="grey-text text-lighten-3" href="https://www.linkedin.com/in/findingjake/">Jake Goldstein</a></li>
            <li><a class="grey-text text-lighten-3" href="https://www.linkedin.com/in/mtsze/">Matt Sze</a></li>
            <li><a class="grey-text text-lighten-3" href="https://www.linkedin.com/in/kestrel-gorlick-1b55911b4/">Kestril Gorlick</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright grey darken-2" >
      <div class="container">
      © 2021 Built To Learn | All Rights Reserved
      </div>
    </div>
  </footer>
  )
}

const mapState = () => {
  return {

  }
}

const mapDispatch = dispatch => {
  return {

  }
}
export default connect(mapState, mapDispatch)(Footer)


