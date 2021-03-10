import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
const socket = io();

const peerConnections = {};

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

class Broadcaster extends Component {
  componentDidMount() {
    const video = document.getElementById('broadcast_watcher_video');
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        socket.emit('broadcaster');
      })
      .catch((error) => console.error(error));

    socket.on('answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('watcher', (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

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

      console.log(peerConnections);
    });

    socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnectPeer', (id) => {
      console.log(id);
      //peerConnections[id].close();
      delete peerConnections[id];
    });
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

export default connect(null)(Broadcaster);
