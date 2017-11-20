/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Headbar extends Component {
  render () {
    return (
      <div className="Headbar">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container">

            <Link to="/" className="navbar-brand">raaay's</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/posts" className="nav-link">Posts</Link>
                </li>
                <li className="nav-item">
                  <Link to="/categories" className="nav-link">Categories</Link>
                </li>
                <li className="nav-item">
                  <Link to="/tags" className="nav-link">Tags</Link>
                </li>
              </ul>
              {/*
              <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
              */}
            </div>

          </div>
        </nav>
      </div>
    )
  }
}

export default Headbar
