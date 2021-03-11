import { io } from 'socket.io-client';
import React, { Component } from 'react';

const socket = io();

// window.onunload = window.onbeforeunload = () => {
//   socket.close();
// };

const room = 'room1';

const typeGlobal = 'student';

let peerConnections = {};

const initialState = { teacher: '', members: [], focus: '', room: '' };

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

class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.changeFocus = this.changeFocus.bind(this);
    this.joinChat = this.joinChat.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
  }
  componentDidMount() {
    socket.on('broadcaster', (id, type) => {
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

    socket.on('disconnect', () => {
      socket.emit('disconnected', this.state.room);
      peerConnections = {};
      this.state.members.forEach((member) => {
        delete this[member];
      });
      this.setState(initialState);
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
  }

  changeFocus(e) {
    this.setState({ focus: e.target.id });
  }

  joinChat(e) {
    e.persist();
    console.log(e.target);
    const video = document.getElementById('selfVideo');
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        socket.emit('broadcaster', socket.id, typeGlobal, e.target.id);
      })
      .catch((error) => console.error(error));
    this.setState({ room: e.target.id });
  }

  leaveChat(e) {
    socket.emit('disconnected', this.state.room);
    peerConnections = {};
    this.state.members.forEach((member) => {
      delete this[member];
    });
    this.setState(initialState);
  }

  //sendChat (message) -> {
  //socket.emit('sendmessage, message)

  //}

  render() {
    return (
      <div id="videos">
        <button id="room1" onClick={(e) => this.joinChat(e)}>
          Join
        </button>
        <button onClick={(e) => this.leaveChat(e)}> Leave</button>
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

export default VideoChat;
