import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Broadcaster } from './index';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="dashboard" className="border">
        <div id="left" className="border"></div>
        <div id="right" className="border">
          <div id="right-pane-1" className="border">
            <div id="right-pane-1-top" className="border">
              <Broadcaster />
            </div>
            <div id="right-pane-1-bottom" className="border"></div>
          </div>
          <div id="right-pane-2" className="border">
            <div id="right-pane-2-top" className="border"></div>
            <div id="right-pane-2-bottom" className="border"></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatch = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatch)(Dashboard);
