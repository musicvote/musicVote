import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Navbar from './navbar'
import AuthForm from './auth-form'

export default function Homepage() {
  return (
    <div>
      <AuthForm />
    </div>
  )
}
// const mapState = state => {
//   return {}
// }

// const mapDispatch = dispatch => {}

// export default connect(mapState, mapDispatch)(Homepage)
