/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarToggler,
  Collapse, Nav, NavItem, NavLink } from 'reactstrap'

export class Headbar extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  render () {
    return (
      <div className="Headbar">
        <Navbar fixed="top" expand="md" color="dark" dark>
          <NavbarBrand href="#">raaay's</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/#/posts/">Posts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/#/categories/">Categories</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/#/tags/">Tags</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
}

export default Headbar
