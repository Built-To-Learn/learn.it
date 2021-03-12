import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Broadcaster, Watcher } from './index';
import { fetchClearView } from '../store/view';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: this.props.room,
      type: this.props.type,
      device: 'camera',
    };
    // this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    // this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  // joinRoomBroadcast(e) {
  //   this.setState({ room: e.target.id, type: 'broadcast' });
  // }
  // joinRoomWatch(e) {
  //   this.setState({ room: e.target.id, type: 'watcher' });
  // }

  render() {
    return (
      <div id="sub-right" className="border">
        <div id="right-pane-1" className="border">
          <div id="right-pane-1-top" className="border">
            {this.state.type === 'broadcast' ? (
              <Broadcaster room={this.state.room} device={this.state.device} />
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
          <div id="right-pane-2-bottom" className="border">
            <button onClick={() => this.props.fetchClearView()}>
              Leave Room
            </button>
            {this.state.type === 'broadcast' ? (
              <button onClick={() => this.setState({ device: 'camera' })}>
                Share Camera
              </button>
            ) : (
              ''
            )}
            {this.state.type === 'broadcast' ? (
              <button onClick={() => this.setState({ device: 'screen' })}>
                Share Screen
              </button>
            ) : (
              ''
            )}
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
  return {
    fetchClearView: () => dispatch(fetchClearView()),
  };
};

export default connect(mapStateToProps, mapDispatch)(Dashboard);
