import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Broadcaster,
  Watcher,
  Chat,
  ViewParticipants,
  Breakout,
  Chatroom,
} from './index';
import { fetchClearView } from '../store/view';
import { fetchClearStudentBreakout } from '../store/student-breakout';
import { fetchReturnToMain } from '../store/student-breakout';
import { Button, Icon } from 'react-materialize';

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
    this.revertToCamera = this.revertToCamera.bind(this);
  }

  resetRoom() {
    if (this.props.studentBreakout.active === true) {
      this.props.fetchClearStudentBreakout();
    }

    this.props.fetchClearView();
  }

  revertToCamera() {
    this.setState({ device: 'camera' });
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.dashboard.room !== this.props.dashboard.room) {
  //     this.setState({ room: this.props.dashboard.room });
  //   }
  // }

  render() {
    console.log(this.props.auth.id, this.props.dashboard.teacher);
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
                revert={this.revertToCamera}
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
          <div id="right-pane-1-bottom" className="border"></div>
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
            {/* <button onClick={() => this.resetRoom()}>Leave Room</button> */}
            {this.state.type === 'broadcast' ? (
              <div>
                <div>
                  <Button
                    node="button"
                    className={`
                      ${
                        this.state.device === 'camera' ? 'blue' : 'black'
                      } left_btn
                    `}
                    small
                    onClick={() => this.setState({ device: 'camera' })}
                  >
                    Webcam
                    <Icon left>camera_front</Icon>
                  </Button>
                  <Button
                    node="button"
                    className={`
                      ${
                        this.state.device === 'screen' ? 'blue' : 'black'
                      } right_btn
                    `}
                    small
                    onClick={() => this.setState({ device: 'screen' })}
                  >
                    Screen share
                    <Icon left>screen_share</Icon>
                  </Button>
                </div>
                <div>
                  <Button
                    node="button"
                    className={`${
                      !this.state.broadCastAudio ? 'black' : 'blue'
                    } left_btn`}
                    small
                    onClick={() =>
                      this.setState({
                        broadCastAudio: !this.state.broadCastAudio,
                      })
                    }
                  >
                    {!this.state.broadCastAudio ? 'Audio off' : 'Audio on'}
                    <Icon left>
                      {!this.state.broadCastAudio ? 'volume_off' : 'volume_up'}
                    </Icon>
                  </Button>
                  <Button
                    node="button"
                    className={`${
                      !this.state.video ? 'black' : 'blue'
                    } right_btn`}
                    small
                    onClick={() =>
                      this.setState({
                        video: !this.state.video,
                      })
                    }
                  >
                    {!this.state.video ? 'Video off' : 'Video on'}
                    <Icon left>
                      {!this.state.video ? 'videocam_off' : 'videocam'}
                    </Icon>
                  </Button>
                </div>
                <div>
                  <Button
                    node="button"
                    className={`
                      ${
                        this.state.topPanel === 'chat' ? 'blue' : 'black'
                      } left_btn
                    `}
                    small
                    onClick={() => this.setState({ topPanel: 'chat' })}
                  >
                    Chat
                    <Icon left>chat</Icon>
                  </Button>
                  <Button
                    node="button"
                    className={`
                      ${
                        this.state.topPanel === 'participants'
                          ? 'blue'
                          : 'black'
                      } right_btn
                    `}
                    small
                    onClick={() => this.setState({ topPanel: 'participants' })}
                  >
                    Participants
                    <Icon left>people</Icon>
                  </Button>
                </div>
                <div>
                  <Button
                    node="button"
                    className="left_btn black"
                    small
                    onClick={() => this.resetRoom()}
                  >
                    Leave
                    <Icon left>exit_to_app</Icon>
                  </Button>
                  <Button
                    node="button"
                    className={`
                      ${
                        this.state.topPanel === 'breakout' ? 'blue' : 'black'
                      } right_btn
                    `}
                    small
                    onClick={() => this.setState({ topPanel: 'breakout' })}
                  >
                    Breakout
                    <Icon left>forum</Icon>
                  </Button>
                </div>
              </div>
            ) : (
              ''
            )}

            {this.state.type === 'watcher' ? (
              <div>
                <div>
                  <Button
                    node="button"
                    className={`${
                      !this.state.mute ? 'blue' : 'black'
                    } left_btn`}
                    small
                    onClick={() =>
                      this.setState({
                        mute: !this.state.mute,
                      })
                    }
                  >
                    {!this.state.mute ? 'Audio on' : 'Mute'}
                    <Icon left>
                      {!this.state.mute ? 'volume_up' : 'volume_off'}
                    </Icon>
                  </Button>
                  <Button
                    node="button"
                    className="right_btn black"
                    small
                    onClick={() => this.resetRoom()}
                  >
                    Leave
                    <Icon left>exit_to_app</Icon>
                  </Button>
                </div>
              </div>
            ) : (
              ''
            )}

            {this.state.type === 'breakout' ? (
              <div>
                <div>
                  <Button
                    node="button"
                    className="left_btn black"
                    small
                    onClick={() => this.resetRoom()}
                  >
                    Leave
                    <Icon left>exit_to_app</Icon>
                  </Button>
                  {this.props.dashboard.teacher === this.props.auth.id ? (
                    <Button
                      node="button"
                      className="right_btn black"
                      small
                      onClick={() =>
                        this.props.fetchReturnToMain(
                          this.state.room.slice(
                            0,
                            this.state.room.lastIndexOf('-')
                          ),
                          'broadcast'
                        )
                      }
                    >
                      Return to main
                      <Icon left>group</Icon>
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ studentBreakout, dashboard, auth }) => {
  return { studentBreakout: studentBreakout, dashboard: dashboard, auth: auth };
};

const mapDispatch = (dispatch) => {
  return {
    fetchClearView: () => dispatch(fetchClearView()),
    fetchClearStudentBreakout: () => dispatch(fetchClearStudentBreakout()),
    fetchReturnToMain: (room, type) => dispatch(fetchReturnToMain(room, type)),
  };
};

export default connect(mapStateToProps, mapDispatch)(Dashboard);
