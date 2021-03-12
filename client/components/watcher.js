import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
const socket = io();

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
    //const video = document.getElementById('broadcast_watcher_video');

    console.log('mounted');
    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.on('offer', (id, description) => {
      console.log('offer');
      //const video = document.getElementById('broadcast_watcher_video');
      const peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('answer', id, peerConnection.localDescription);
        });
      // peerConnection.ontrack = (event) => {
      //   console.log('tracking');
      //   console.log(event);
      //   video.srcObject = event.streams[0];
      // };
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

    socket.emit('watcher', this.props.room);

    socket.on('broadcaster', () => {
      socket.emit('watcher', this.props.room);
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
    return (
      <div>
        {this.state.broadcaster === '' ? (
          'no one here'
        ) : (
          <video
            id="broadcast_watcher_video"
            className="broadcast_watcher"
            playsInline
            autoPlay
            ref={(vid) => {
              this.selfVideo = vid;
            }}
          ></video>
        )}
      </div>
    );
  }
}

export default connect(null)(Watcher);
