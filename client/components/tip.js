import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
const stripePromise = loadStripe(
  'pk_test_51ILK1lLfvWrZDmuZMXaRPM2DZJTsiWZCLF0kN6XuqF9jMLq5eYjh59Vaqvr1XshlKGPRbF2Q1PRxFv1G72IZBCpf000VL6GWuC'
);
import { Button, Icon } from 'react-materialize';

const Tip = ({ auth, dashboard, handleClick }) => {
  // console.log(auth);
  const [teacher, setTeacher] = useState({});
  useEffect(() => {
    const init = async () => {
      const teacher = (await axios.get(`/api/users/${dashboard.teacher}`)).data;
      setTeacher(teacher);
    };

    init();
  }, []);

  return (
    <div>
      {console.log(auth)}
      <Button
        node="button"
        className={`deep-orange accent-1 ${!auth.onboarded ? 'disabled' : ''}`}
        small
        onClick={() => handleClick(teacher)}
      >
        {!auth.onboarded ? 'Setup payments' : 'Tip'}
        <Icon left>attach_money</Icon>
      </Button>
      {/* <button className="btn" onClick={() => handleClick(teacher)}>Tip</button> */}
    </div>
  );
};

const mapState = ({ auth, dashboard }) => {
  return {
    auth,
    dashboard,
  };
};

const mapDispatch = (dispatch) => {
  return {
    async handleClick(teacher) {
      const stripe = await stripePromise;
      const items = [
        {
          name: 'teacher tip',
          amount: 1000,
          currency: 'usd',
          quantity: 1,
        },
      ];

      const session = (
        await axios.post('/auth/stripe/checkout', {
          items,
          destination: teacher.stripeAcc,
        })
      ).data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    },
  };
};

export default connect(mapState, mapDispatch)(Tip);
