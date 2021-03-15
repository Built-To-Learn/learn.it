import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBreakout } from '../store/breakout';
import { fetchStudentBreakout } from '../store/student-breakout';

class Breakout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: this.props.participants.reduce((acc, peer) => {
        acc[peer.id] = { name: peer.name, group: 1 };
        return acc;
      }, {}),
      teacher: 1,
    };
    this.shift = this.shift.bind(this);
    this.createRooms = this.createRooms.bind(this);
    this.shiftTeacher = this.shiftTeacher.bind(this);
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

  shiftTeacher() {
    if (this.state.teacher === 3) {
      this.setState({ teacher: 1 });
    } else {
      this.setState({ teacher: this.state.teacher + 1 });
    }
  }

  async createRooms() {
    await this.props.fetchBreakout({
      active: true,
      rooms: this.state.participants,
    });
    this.props.fetchStudentBreakout(`${this.props.room}-${this.state.teacher}`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.participants.length !== this.props.participants.length) {
      const temp = this.state.participants;
      const peers = Object.keys(temp);
      const newPeers = this.props.participants.map((peer) => peer.id);
      this.props.participants.forEach((peer) => {
        if (!peers.includes(peer.id)) {
          temp[peer.id] = { name: peer.name, group: 1 };
        }
      });
      peers.forEach((key) => {
        if (!newPeers.includes(key)) {
          delete temp[key];
        }
      });
      this.setState(temp);
    }
  }

  render() {
    return (
      <div id="breakout">
        <ul>
          <li onClick={() => this.shiftTeacher()}>
            {' '}
            Teacher Group {this.state.teacher}
          </li>
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
      fetchStudentBreakout: (room) => dispatch(fetchStudentBreakout(room)),
    };
  }
)(Breakout);
