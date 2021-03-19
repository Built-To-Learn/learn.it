import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Broadcaster,
  Watcher,
  Chat,
  ViewParticipants,
  Breakout,
  Chatroom,
  Questions
} from './index';
import { fetchClearView } from '../store/view';
import { fetchClearStudentBreakout } from '../store/student-breakout';
import { fetchReturnToMain } from '../store/student-breakout';
//import { ViewParticipants } from './viewParticipants';
// import { peerConnections } from './broadcaster';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: this.props.room,
      type: this.props.type,
      device: 'camera',
      mute: false,
      broadCastAudio: true,
      video: true,
      topPanel: 'chat',
    };
    this.resetRoom = this.resetRoom.bind(this);
  }

  resetRoom() {
    if (this.props.studentBreakout.active === true) {
      this.props.fetchClearStudentBreakout();
    }

    this.props.fetchClearView();
  }

  render() {
    return (
      <div id="sub-right" className="border">
        <div id="right-pane-1" className="border">
          <div id="right-pane-1-top" className="border">
            {this.state.type === 'broadcast' ? (
              <Broadcaster
                room={this.state.room}
                device={this.state.device}
                audio={this.state.broadCastAudio}
                video={this.state.video}
              />
            ) : (
              ''
            )}
            {this.state.type === 'watcher' ? (
              <Watcher room={this.state.room} mute={this.state.mute} />
            ) : (
              ''
            )}
            {this.state.type === 'breakout' ? (
              <Chatroom room={this.state.room} mute={this.state.mute} />
            ) : (
              ''
            )}
          </div>
          <div id="right-pane-1-bottom" className="border">
            <Questions/>
          </div>
        </div>
        <div id="right-pane-2" className="border">
          <div id="right-pane-2-top" className="border">
            {this.state.topPanel === 'chat' ? (
              <Chat room={this.state.room} />
            ) : (
              ''
            )}
            {this.state.topPanel === 'participants' ? <ViewParticipants /> : ''}
            {this.state.topPanel === 'breakout' ? (
              <Breakout room={this.state.room} />
            ) : (
              ''
            )}
          </div>
          <div id="right-pane-2-bottom" className="border">
            <button onClick={() => this.resetRoom()}>Leave Room</button>
            {this.state.type === 'broadcast' ? (
              <div>
                <button onClick={() => this.setState({ device: 'camera' })}>
                  Share Camera
                </button>
                <button onClick={() => this.setState({ device: 'screen' })}>
                  Share Screen
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      broadCastAudio: !this.state.broadCastAudio,
                    })
                  }
                >
                  Mute
                </button>
                <button
                  onClick={() => this.setState({ video: !this.state.video })}
                >
                  Video
                </button>
                <button
                  onClick={() => this.setState({ topPanel: 'participants' })}
                >
                  Participants
                </button>
                <button onClick={() => this.setState({ topPanel: 'chat' })}>
                  Chat
                </button>
                <button onClick={() => this.setState({ topPanel: 'breakout' })}>
                  Breakout
                </button>
              </div>
            ) : (
              ''
            )}

            {this.state.type === 'watcher' ? (
              <button onClick={() => this.setState({ mute: !this.state.mute })}>
                Mute
              </button>
            ) : (
              ''
            )}
            {this.state.type === 'breakout' ? (
              <button
                onClick={() =>
                  this.props.fetchReturnToMain(
                    this.state.room.slice(0, this.state.room.lastIndexOf('-')),
                    'broadcast'
                  )
                }
              >
                Return to main
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

const mapStateToProps = ({ studentBreakout }) => {
  return { studentBreakout: studentBreakout };
};

const mapDispatch = (dispatch) => {
  return {
    fetchClearView: () => dispatch(fetchClearView()),
    fetchClearStudentBreakout: () => dispatch(fetchClearStudentBreakout()),
    fetchReturnToMain: (room, type) => dispatch(fetchReturnToMain(room, type)),
  };
};

export default connect(mapStateToProps, mapDispatch)(Dashboard);
