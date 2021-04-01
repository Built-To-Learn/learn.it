import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from '../store';
import M from 'materialize-css';

const Icons = () => {
  useEffect(() => {
    let elements = document.querySelectorAll('.parallax');
    M.Parallax.init(elements);
  });

  return (
    <div className="container">
      <div className="section">
        <div className="row">
          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center white-text">
                <i className="material-icons medium">library_books</i>
              </h2>
              <h5 className="center deep-orange-text text-accent-1">Find your classroom</h5>

              <p className="light grey-text text-lighten-2 center">
                Learn.it is a free virtual learning platform. Simply join a
                class of your interest to get started. There are no limits on
                how many classes you can join or attend. Let your learning
                journey start today!
              </p>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center white-text">
                <i className="material-icons medium">group</i>
              </h2>
              <h5 className="center deep-orange-text text-accent-1">Community of peers</h5>

              <p className="light grey-text text-lighten-2 center">
                You won't be learning alone. Learn.it's platform supports live
                teacher sessions, interactive breakout sessions, chat, Q&A, and
                community messaging boards.
              </p>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="icon-block">
              <h2 className="center white-text">
                <i className="material-icons medium">assignment_ind</i>
              </h2>
              <h5 className="center deep-orange-text text-accent-1">Become a teacher</h5>

              <p className="light grey-text text-lighten-2 center">
                Learn.it's members are also teachers. To become a teacher,
                simply create a course and class schedule. No fancy prepared
                content is necessary, just you!
              </p>
            </div>
          </div>
        </div>
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

export default connect(mapState, mapDispatch)(Icons);
