import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBreakout } from '../store/breakout';

class Breakout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: this.props.participants.reduce((acc, peer) => {
        acc[peer.id] = { name: peer.name, group: 1 };
        return acc;
      }, {}),
    };
    this.shift = this.shift.bind(this);
    this.createRooms = this.createRooms.bind(this);
  }

  shift(e) {
    const temp = this.state.participants;
    const id = e.target.id;
    if (temp[id].group === 3) {
      temp[id].group = 1;
    } else {
      temp[id].group = temp[id].group + 1;
    }
    this.setState({ participants: temp });
  }

  createRooms() {
    this.props.fetchBreakout({ active: true, rooms: this.state.participants });
  }
  render() {
    return (
      <div id="breakout">
        <ul>
          {Object.keys(this.state.participants).map((peer) => {
            return (
              <li key={peer} id={peer} onClick={(e) => this.shift(e)}>
                {this.state.participants[peer].name} Group{' '}
                {this.state.participants[peer].group}
              </li>
            );
          })}
        </ul>
        <button onClick={() => this.createRooms()}>Create Rooms</button>
      </div>
    );
  }
}

export default connect(
  ({ participants }) => {
    return {
      participants: participants,
    };
  },
  (dispatch) => {
    return {
      fetchBreakout: (data) => dispatch(fetchBreakout(data)),
    };
  }
)(Breakout);
