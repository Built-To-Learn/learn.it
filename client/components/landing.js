import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dashboard } from './index';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { view: '', room: '', type: '' };
    this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  joinRoomBroadcast(e) {
    this.setState({ view: 'dashboard', room: e.target.id, type: 'broadcast' });
  }
  joinRoomWatch(e) {
    this.setState({ view: 'dashboard', room: e.target.id, type: 'watcher' });
  }

  render() {
    const view = this.state.view;
    return (
      <div id="dashboard" className="border">
        <div id="left" className="border">
          <button id="room1" onClick={(e) => this.joinRoomBroadcast(e)}>
            Join room as teacher
          </button>
          <button id="room1" onClick={(e) => this.joinRoomWatch(e)}>
            Join room as watcher
          </button>
        </div>
        <div id="right" className="border">
          {view === 'dashboard' ? (
            <Dashboard room={this.state.room} type={this.state.type} />
          ) : (
            ''
          )}
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

export default connect(mapStateToProps, mapDispatch)(Landing);
