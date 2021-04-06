import React from 'react';
import { connect } from 'react-redux';

const ViewParticipants = (props) => {
  if(props.participants.length === 0){
    return (
      <div id="participants" className="container">
        <p>No Participants</p>
      </div>
    )
  }
  return (
    <div id="participants">
      <div className="container">
        <ul>
          {props.participants.map((peer) => {
            return <li key={peer.id}>{peer.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default connect(({ participants }) => {
  return {
    participants: participants,
  };
})(ViewParticipants);
