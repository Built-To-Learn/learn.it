import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../store';
import Icons from './icons';
import Footer from './footer'
import M from 'materialize-css';

const Parallax = () => {
  useEffect(() => {
    let elements = document.querySelectorAll('.parallax');
    M.Parallax.init(elements);
  });

  return (
    <div>
      <div id="index-banner" className="parallax-container">
        <div className="section no-pad-bot">
          <div className="container">
            <br></br>
            <h1 className="header center white-text text-lighten-2">
              Learn It
            </h1>
            <div className="row center">
              <h5 className="header col s12 light white-text">
                Bringing the best teachers to every student... one live stream
                at a time.
              </h5>
            </div>
            <div className="row center">
              <Link
                to="/signup"
                id="download-button"
                className="btn-large deep-orange accent-2 waves-effect waves-light teal lighten-1"
              >
                Get Started
              </Link>
            </div>
            <br></br>
          </div>
        </div>
        <div className="parallax">
          <img src="assets/blackboard.jpg" />
        </div>
      </div>
      <div className="grey darken-4">
        <Icons />
      </div>
      <div className="grey darken-4">
        <Footer />
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Parallax);
