/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'

import Index from './components/Index'
import Login from './components/Login'
import PostList from './components/PostList'
import Post from './components/Post'
import PostImage from './components/PostImage'
import Category from './components/Category'
import CategoryList from './components/CategoryList'
import Tag from './components/Tag'
import TagList from './components/TagList'
import Headbar from './components/layouts/Header'

class App extends Component {
  constructor () {
    super()
    this.requireAuth = this.requireAuth.bind(this)
  }

  logout (nextState, replace) {
    sessionStorage.removeItem('token')
  }

  requireAuth (nextState, replace, callback) {
    const token = sessionStorage.get('token')
    if (!token) {
      replace('/login')
    }
  }

  render () {
    return (
      <HashRouter>
        <div className="app">
          <Headbar/>

          <Route exact path="/" component={Login}/>
          <Route path="/login" component={Login}/>

          <Switch>
            <PrivateRoute path="/posts/:postSlug/images" component={PostImage}/>
            <PrivateRoute path="/posts/:postSlug" component={Post}/>
            <PrivateRoute path="/posts" component={PostList}/>
          </Switch>

          <Switch>
            <PrivateRoute path="/categories/:categorySlug" component={Category}/>
            <PrivateRoute path="/categories" component={CategoryList}/>
          </Switch>

          <Switch>
            <PrivateRoute path="/tags/:tagSlug" component={Tag}/>
            <PrivateRoute path="/tags" component={TagList}/>
          </Switch>

        </div>
      </HashRouter>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    sessionStorage.getItem('token') ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

export default App
