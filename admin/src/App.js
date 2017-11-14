/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'

import './App.css'

import Index from './components/Index'
import Login from './components/Login'
import PostList from './components/PostList'
import Post from './components/Post'
import Category from './components/Category'
import CategoryList from './components/CategoryList'
import Tag from './components/Tag'
import TagList from './components/TagList'
import Headbar from './components/layouts/Header'

class App extends Component {
  render () {
    return (
      <HashRouter>
        <div className="app">
          <Headbar/>
          <Route exact path="/" component={Index}/>
          <Route path="login" component={Login}/>
          <Route path="/posts" component={PostList}/>
          <Route path="/posts/:postSlug" component={Post}/>
          <Route path="/categories" component={CategoryList}/>
          <Route path="/categories/:categoryName" component={Category}/>
          <Route path="/tags" component={TagList}/>
          <Route path="/tags/:tagName" component={Tag}/>
        </div>
      </HashRouter>
    )
  }
}

export default App
