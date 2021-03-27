import { io } from 'socket.io-client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchClearStudentBreakout,
  fetchReturnToMain,
  fetchFinalReturn,
} from '../store/student-breakout';
import { fetchClearBreakout } from '../store/breakout';

// window.onunload = window.onbeforeunload = () => {
//   socket.close();
// };

const room = 'room1';

const typeGlobal = 'student';

let peerConnections = {};

let globalStream;
//const initialState = { teacher: '', members: [], focus: '', room: '' };

const config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    // {
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ],
};

// Media contrains
const constraints = {
  video: { facingMode: 'user' },
  // Uncomment to enable audio
  audio: true,
};

let socket;

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacher: '',
      members: [],
      focus: '',
      room: this.props.room,
    };
    this.changeFocus = this.changeFocus.bind(this);
  }
  componentDidMount() {
    socket = io();

    socket.on('connect', () => {
      const video = document.getElementById('selfVideo');
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          globalStream = stream;
          video.srcObject = globalStream;
          socket.emit(
            'breakout_broadcaster',
            socket.id,
            typeGlobal,
            this.state.room
          );
        })
        .catch((error) => console.error(error));
    });

    socket.on('breakout_broadcaster', (id, type) => {
      const video = document.getElementById('selfVideo');
      const peerConnection = new RTCPeerConnection(config);
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('breakout_candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            'breakout_offer',
            id,
            peerConnection.localDescription,
            typeGlobal
          );
        });

      peerConnections[id] = peerConnection;

      if (type === 'student') {
        this.setState({
          members: [...this.state.members, id],
        });
      } else if (type === 'teacher') {
        this.setState({
          teacher: id,
          members: [...this.state.members, id],
        });
      }
    });

    socket.on('breakout_answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('breakout_offer', (id, description, type) => {
      const peerConnection = new RTCPeerConnection(config);

      const video = document.getElementById('selfVideo');
      // const video = this.selfVideo;
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('breakout_answer', id, peerConnection.localDescription);
        });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('breakout_candidate', id, event.candidate);
        }
      };

      peerConnections[id] = peerConnection;

      if (type === 'student') {
        this.setState({
          members: [...this.state.members, id],
        });
      } else if (type === 'teacher') {
        this.setState({
          teacher: id,
          members: [...this.state.members, id],
        });
      }
    });

    socket.on('breakout_candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnectPeer', (id) => {
      if (id === this.state.focus) {
        this.setState({ focus: '' });
      }
      if (peerConnections[id]) {
        peerConnections[id].close();
        delete peerConnections[id];
        delete this[id];
      }

      if (this.state.members.includes(id)) {
        this.setState({
          members: this.state.members.filter((peer) => peer !== id),
        });
      } else if (id === this.state.teacher) {
        this.setState({
          teacher: '',
          members: this.state.members.filter((peer) => peer !== id),
        });
      }
    });

    socket.on('breakout_returnToMain', (room) => {
      this.props.fetchReturnToMain(room, 'watcher');
      this.props.fetchFinalReturn();
    });
  }

  componentDidUpdate() {
    if (this.props.studentBreakout.return === true) {
      socket.emit('breakout_returnToMain', this.state.room);
      this.props.fetchFinalReturn();
    }

    this.state.members.forEach((member) => {
      peerConnections[member].ontrack = (event) => {
        this[member].srcObject = event.streams[0];
      };
    });
    if (this.state.focus !== '') {
      this.focus.srcObject = this[this.state.focus].srcObject;
    } else {
      this.focus.srcObject = null;
    }
  }

  changeFocus(e) {
    this.setState({ focus: e.target.id });
  }
  componentWillUnmount() {
    try {
      globalStream.getTracks().forEach((track) => track.stop());
    } catch {}

    socket.close();
  }

  render() {
    return (
      <div id="videos">
        <div id="mini_videos">
          <video
            id="selfVideo"
            className="video_player"
            playsInline
            autoPlay
            muted
            ref={(vid) => {
              this.selfVideo = vid;
            }}
            onClick={(e) => this.changeFocus(e)}
          ></video>

          {this.state.members.map((member) => {
            return (
              <video
                key={member}
                id={member}
                className="video_player"
                playsInline
                autoPlay
                ref={(vid) => {
                  this[member] = vid;
                }}
                onClick={(e) => this.changeFocus(e)}
              ></video>
            );
          })}
        </div>
        <div id="focus_video_div">
          <video
            id="focus"
            key={this.state.focus}
            playsInline
            autoPlay
            muted
            ref={(vid) => {
              this.focus = vid;
            }}
          ></video>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ studentBreakout }) => {
    return {
      studentBreakout: studentBreakout,
    };
  },
  (dispatch) => {
    return {
      fetchClearStudentBreakout: () => {
        dispatch(fetchClearStudentBreakout());
      },
      fetchClearBreakout: () => {
        dispatch(fetchClearBreakout());
      },
      fetchReturnToMain: (room, type) => {
        dispatch(fetchReturnToMain(room, type));
      },
      fetchFinalReturn: () => dispatch(fetchFinalReturn()),
    };
  }
)(Chatroom);
