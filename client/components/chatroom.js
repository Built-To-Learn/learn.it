import { io } from 'socket.io-client';
import React, { Component } from 'react';

const socket = io();

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

const typeGlobal = 'student';

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

// Media contrains
const constraints = {
  video: { facingMode: 'user' },
  // Uncomment to enable audio
  audio: true,
};

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = { teacher: '', members: [], focus: '' };
    this.changeFocus = this.changeFocus.bind(this);
  }
  componentDidMount() {
    // const video = this.selfVideo;
    const video = document.getElementById('selfVideo');
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        socket.emit('broadcaster', socket.id, typeGlobal);
      })
      .catch((error) => console.error(error));

    socket.on('broadcaster', (id, type) => {
      // const video = document.getElementById('self');
      const video = document.getElementById('selfVideo');
      const peerConnection = new RTCPeerConnection(config);
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
          socket.emit('offer', id, peerConnection.localDescription, typeGlobal);
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

    socket.on('answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('offer', (id, description, type) => {
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
          socket.emit('answer', id, peerConnection.localDescription);
        });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
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

    socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnectPeer', (id) => {
      if (id === this.state.focus) {
        this.focus.srcObject = this.selfVideo.srcObject;
      }
      peerConnections[id].close();
      delete peerConnections[id];
      delete this[id];
      if (this.state.members.includes(id)) {
        this.setState({
          members: this.state.members.filter((peer) => peer !== id),
        });
      } else {
        this.setState({
          teacher: '',
          members: this.state.members.filter((peer) => peer !== id),
        });
      }
    });
  }

  componentDidUpdate() {
    this.state.members.forEach((member) => {
      peerConnections[member].ontrack = (event) => {
        this[member].srcObject = event.streams[0];
      };
    });
    if (this.state.focus !== '') {
      this.focus.srcObject = this[this.state.focus].srcObject;
    }

    // if (this.state.focus !== '') {
    //   console.log(this.state.focus);
    //   peerConnections[this.state.focus].ontrack = (event) => {
    //     this.focus.srcObject = event.streams[0];
    //   };
    // }
  }

  changeFocus(e) {
    console.log(e.target);
    // this.focus.srcObject = this[e.target.id].srcObject;
    // peerConnections[e.target.id].ontrack = (event) => {
    //   this.focus.srcObject = event.streams[0];
    // };

    this.setState({ focus: e.target.id });
  }
  render() {
    return (
      <div id="videos">
        <div>
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
                muted
                ref={(vid) => {
                  this[member] = vid;
                }}
                onClick={(e) => this.changeFocus(e)}
              ></video>
            );
          })}
        </div>
        <div>
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

export default Chatroom;
