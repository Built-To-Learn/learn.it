import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dashboard } from './index';
import { fetchView } from '../store/view';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { room: '', type: '' };
    this.joinRoomBroadcast = this.joinRoomBroadcast.bind(this);
    this.joinRoomWatch = this.joinRoomWatch.bind(this);
  }
  joinRoomBroadcast(e) {
    this.setState({ room: e.target.id, type: 'broadcast' });
    this.props.fetchView('dashboard');
  }
  joinRoomWatch(e) {
    this.setState({ room: e.target.id, type: 'watcher' });
    this.props.fetchView('dashboard');
  }

  render() {
    console.log('view', this.props.view);
    const view = this.props.view;
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

const mapStateToProps = ({ view }) => {
  return {
    view: view,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchView: (view) => dispatch(fetchView(view)),
  };
};

export default connect(mapStateToProps, mapDispatch)(Landing);
