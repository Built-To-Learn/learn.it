import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import {
  fetchAddPeer,
  fetchRemovePeer,
  fetchClearPeer,
} from '../store/participants';

import { fetchClearBreakout } from '../store/breakout';

let socket;

export const peerConnections = {};

let globalStream;
let videoTrack;
let audioTrack;

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

const gdmOptions = {
  video: true,
  audio: false,
};

class Broadcaster extends Component {
  constructor(props) {
    super(props);
    console.log('broadcaser:', props);
    this.state = { room: props.room };
  }
  componentDidMount() {
    socket = io();
    const video = document.getElementById('broadcast_watcher_video');

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        globalStream = stream;
        video.srcObject = globalStream;
        socket.emit('broadcaster', this.props.room);
      })
      .catch((error) => console.error(error));

    socket.on('answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('watcher', (id, name) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      this.props.fetchAddPeer({ id: id, name: name });

      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('offer', id, peerConnection.localDescription);
        });
    });

    socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnect', () => {
      socket.emit('leavingRoom', this.props.room);
    });

    socket.on('disconnectPeer', (id) => {
      delete peerConnections[id];
      this.props.fetchRemovePeer(id);
    });
  }

  async componentDidUpdate() {
    if (this.props.breakout.active === true) {
      socket.emit('breakout', this.props.room, this.props.breakout.rooms);
    } else {
      const video = document.getElementById('broadcast_watcher_video');

      if (this.props.audio || this.props.video) {
        if (this.props.device === 'camera') {
          if (!this.props.video) {
            constraints.video = false;
          } else {
            constraints.video = { facingMode: 'user' };
          }
          if (!this.props.audio) {
            constraints.audio = false;
          } else {
            constraints.audio = true;
          }

          await navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
              try {
                globalStream.getTracks().forEach((track) => track.stop());
                videoTrack.getTracks().forEach((track) => track.stop());
                audioTrack.getTracks().forEach((track) => track.stop());
              } catch {}

              globalStream = stream;
              video.srcObject = stream;
            })
            .catch((error) => console.error(error));
        } else {
          if (!this.props.video) {
            gdmOptions.video = false;
          } else {
            gdmOptions.video = true;
          }

          await navigator.mediaDevices
            .getDisplayMedia(gdmOptions)
            .then(async (stream) => {
              try {
                globalStream.getTracks().forEach((track) => track.stop());
                videoTrack.getTracks().forEach((track) => track.stop());
                audioTrack.getTracks().forEach((track) => track.stop());
              } catch {}
              [videoTrack] = stream.getVideoTracks();
              let newStream;
              if (this.props.audio) {
                const audioStream = await navigator.mediaDevices
                  .getUserMedia({ audio: this.props.audio })
                  .catch((e) => {
                    throw e;
                  });
                [audioTrack] = audioStream.getAudioTracks();
                newStream = new MediaStream([videoTrack, audioTrack]);
              } else {
                newStream = new MediaStream([videoTrack]);
              }

              globalStream = newStream;
              video.srcObject = newStream;
            })
            .catch((error) => {
              console.error(error);
              this.props.revert();
            });
        }
      } else {
        try {
          globalStream.getTracks().forEach((track) => track.stop());
          videoTrack.getTracks().forEach((track) => track.stop());
          audioTrack.getTracks().forEach((track) => track.stop());
        } catch {}
      }
    }

    Object.keys(peerConnections).forEach((key) => {
      const senders = peerConnections[key].getSenders();
      senders.forEach((sender) => peerConnections[key].removeTrack(sender));
    });
    socket.emit('renew', this.props.room);
  }

  componentWillUnmount() {
    try {
      globalStream.getTracks().forEach((track) => track.stop());
      videoTrack.getTracks().forEach((track) => track.stop());
      audioTrack.getTracks().forEach((track) => track.stop());
    } catch (er) {}

    socket.close();
    this.props.fetchClearPeer();
    this.props.fetchClearBreakout();
  }

  render() {
    return (
      <video
        id="broadcast_watcher_video"
        className="broadcast_watcher"
        playsInline
        autoPlay
        muted
      ></video>
    );
  }
}

export default connect(
  ({ breakout }) => {
    return {
      breakout: breakout,
    };
  },
  (dispatch) => {
    return {
      fetchAddPeer: (peer) => dispatch(fetchAddPeer(peer)),
      fetchRemovePeer: (peer) => dispatch(fetchRemovePeer(peer)),
      fetchClearPeer: () => dispatch(fetchClearPeer()),
      fetchClearBreakout: () => dispatch(fetchClearBreakout()),
    };
  }
)(Broadcaster);
