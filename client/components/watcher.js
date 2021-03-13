import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';

let socket;

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

const constraints = {
  video: { facingMode: 'user' },
  // Uncomment to enable audio
  audio: true,
};

const broadcaster = {};

class Watcher extends Component {
  constructor(props) {
    super(props);
    this.state = { broadcaster: '', playing: 'false', room: props.room };
  }
  componentDidMount() {
    socket = io();

    socket.on('offer', (id, description) => {
      console.log('offer');

      const peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('answer', id, peerConnection.localDescription);
        });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
        }
      };
      broadcaster[id] = peerConnection;

      this.setState({ broadcaster: id });
    });

    socket.on('candidate', (id, candidate) => {
      broadcaster[id]
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.emit('watcher', this.props.room, this.props.auth);

    socket.on('broadcaster', () => {
      socket.emit('watcher', this.props.room, this.props.auth);
    });

    socket.on('disconnectPeer', (id) => {
      if (id === this.state.broadcaster) {
        this.setState({ broadcaster: '', playing: 'false' });
      }
    });
  }

  componentDidUpdate() {
    if (this.state.broadcaster !== '') {
      broadcaster[this.state.broadcaster].ontrack = (event) => {
        this.selfVideo.srcObject = event.streams[0];
      };
    }
  }

  componentWillUnmount() {
    socket.close();
  }

  render() {
    console.log(this.state.broadcaster);
    return (
      <div id="main_video_frame">
        {this.state.broadcaster === '' ? (
          'The teacher will arrive shortly...'
        ) : (
          <video
            id="broadcast_watcher_video"
            className="broadcast_watcher"
            playsInline
            autoPlay
            muted={!!this.props.mute}
            ref={(vid) => {
              this.selfVideo = vid;
            }}
          ></video>
        )}
      </div>
    );
  }
}

export default connect(({ auth }) => {
  return {
    auth: auth.name,
  };
})(Watcher);
