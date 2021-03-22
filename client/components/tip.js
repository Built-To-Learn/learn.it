import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
const stripePromise = loadStripe("pk_test_51ILK1lLfvWrZDmuZMXaRPM2DZJTsiWZCLF0kN6XuqF9jMLq5eYjh59Vaqvr1XshlKGPRbF2Q1PRxFv1G72IZBCpf000VL6GWuC");

const Tip = ({dashboard, handleClick}) => {
  const [teacher, setTeacher] = useState({})
  useEffect(() => {
    const init = async () => {
        // get stripeAcc of teacher pass to handle click
      const teacher = (await axios.get(`/api/users/${dashboard.teacher}`)).data
      setTeacher(teacher)
    }

    init()

  }, [])

  return(
    <div>
      <button className="btn" onClick={() => handleClick(teacher)}>Tip</button>
    </div>
  )

}

const mapState = ({dashboard}) => {
  return {
      dashboard
  }
}

const mapDispatch = (dispatch) => {
  return {
      async handleClick(teacher){
        const stripe = await stripePromise
        const items = [{
          name: "tip test",
          amount: 1000,
          currency: "usd",
          quantity: 1
        }]

        const session = (await axios.post('/auth/stripe/checkout', {
          items,
          destination: teacher.stripeAcc
        })).data


        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          console.log(result.error)
        }
      }
  }
}

export default connect(mapState, mapDispatch)(Tip)
