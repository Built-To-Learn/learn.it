import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io();

const peerConnections = {};

let globalStream;

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
    this.state = { room: props.room };
  }
  componentDidMount() {
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

    socket.on('disconnect', () => {
      console.log('hit');
      socket.emit('leavingRoom', this.props.room);
    });

    socket.on('disconnectPeer', (id) => {
      console.log(id);
      delete peerConnections[id];
    });
  }

  async componentDidUpdate(prevProps) {
    console.log(prevProps);
    if (prevProps.device && prevProps.device !== this.props.device) {
      const video = document.getElementById('broadcast_watcher_video');
      if (this.props.device === 'camera') {
        await navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            globalStream = stream;
            video.srcObject = stream;
          })
          .catch((error) => console.error(error));
      } else {
        await navigator.mediaDevices
          .getDisplayMedia(gdmOptions)
          .then(async (stream) => {
            const [videoTrack] = stream.getVideoTracks();
            const audioStream = await navigator.mediaDevices
              .getUserMedia({ audio: true })
              .catch((e) => {
                throw e;
              });
            const [audioTrack] = audioStream.getAudioTracks();
            const newStream = new MediaStream([videoTrack, audioTrack]);

            globalStream = newStream;
            video.srcObject = newStream;
          })
          .catch((error) => console.error(error));
      }

      Object.keys(peerConnections).forEach((key) => {
        const senders = peerConnections[key].getSenders();
        senders.forEach((sender) => peerConnections[key].removeTrack(sender));
      });
      socket.emit('renew', this.props.room);
    }
  }

  componentWillUnmount() {
    globalStream.getTracks().forEach((track) => track.stop());
    socket.close();
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
