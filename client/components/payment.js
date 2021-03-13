import React, { useEffect } from 'react'

const Payment = () => {
  useEffect(() => {
    console.log("MOUNTED")
  })

  return (
    <div>
      <a className="btn">TIP</a>
    </div>
  )
}

export default Payment
