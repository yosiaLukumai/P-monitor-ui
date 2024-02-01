import React from 'react'
import { Navigate } from 'react-router-dom'
import { retriveData } from '../utils/localStorage'
function Protected({  children }) {
  
  if (!retriveData("PData")) {
    return <Navigate to="/" replace={true} />
  }
  return children
}
export default Protected