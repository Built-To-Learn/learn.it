import React from 'react';
import { connect } from 'react-redux';

const ViewParticipants = (props) => {
  return (
    <ul>
      {console.log(props)}
      {props.participants.map((peer) => {
        return <li key={peer.id}>{peer.name}</li>;
      })}
    </ul>
  );
};

export default connect(({ participants }) => {
  return {
    participants: participants,
  };
})(ViewParticipants);
