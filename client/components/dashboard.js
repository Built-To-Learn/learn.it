import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Broadcaster, Watcher } from './index';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { room: '', type: '' };
    this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  joinRoomBroadcast(e) {
    this.setState({ room: e.target.id, type: 'broadcast' });
  }
  joinRoomWatch(e) {
    this.setState({ room: e.target.id, type: 'watcher' });
  }

  render() {
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
          <div id="right-pane-1" className="border">
            <div id="right-pane-1-top" className="border">
              {this.state.type === 'broadcast' ? (
                <Broadcaster room={this.state.room} />
              ) : (
                ''
              )}
              {this.state.type === 'watcher' ? (
                <Watcher room={this.state.room} />
              ) : (
                ''
              )}
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
