/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

import '../style/login.css'

import * as TokenApi from '../api/token'

export class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  render () {
    return (
      <div className="Login">
        <div className="container content">
          <Form className="form-signin">
            <h2 className="form-signin-heading">log in</h2>
            <FormGroup>
              <Label for="inputUsername">Username</Label>
              <Input type="text" id="inputUsername" placeholder="Uername" required
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="inputPassword">Password</Label>
              <Input type="password" id="inputPassword" placeholder="Password" required
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
              />
            </FormGroup>
            <Button color="dark" block onClick={(e) => this.handleLogin(e)}>Log in</Button>
          </Form>
        </div>
      </div>
    )
  }

  async login (body) {
    const res = await TokenApi.getToken(body)
    const token = res.token
    sessionStorage.setItem('token', token)
    this.props.history.push('/posts') // TODO
  }

  handleLogin () {
    if (!this.state.username || !this.state.password) {
      return
    }
    const body = {
      username: this.state.username,
      password: this.state.password
    }
    this.login(body)
  }
}

export default Login
