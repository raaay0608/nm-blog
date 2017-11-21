/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import * as TagApi from '../api/tag'

export class Tag extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tag: {
        _id: '',
        name: ''
      }
    }
  }

  componentWillMount () {
    this.fetchTag(this.props.match.params.tagName)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchTag(nextProps.match.params.tagName)
  }

  render () {
    return (
      <div className="Tag">
        <div className="container content">

          <Form>
            <FormGroup disabled>
              <Label for="idText">ID</Label>
              <Input disabled type="text" name="id" id="idText"
                value={this.state.tag._id}
                onChange={(e) => { this.mergeAndSetState('tag', '_id', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="nameText">Name</Label>
              <Input type="text" name="name" id="nameText"
                value={this.state.tag.name}
                onChange={(e) => { this.mergeAndSetState('tag', 'name', e.target.value) }}
              />
            </FormGroup>
            <Button outline color="primary" onClick={() => this.handleSave()}>Save</Button>&nbsp;
            <Button outline color="danger" onClick={() => this.handleDelete()}>Remove</Button>
          </Form>

        </div>
      </div>
    )
  }

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  async fetchTag (tagName) {
    const res = await TagApi.getTag(tagName)
    this.setState({tag: res.tag})
  }

  async updateTag (tagName, data) {
    const res = await TagApi.updateTag(tagName, data)
    const newTagName = res.tag.name
    this.props.history.push(`/tags/${newTagName}`)
  }

  handleSave () {
    const tagName = this.props.match.params.tagName
    const data = {
      name: this.state.tag.name
    }
    this.updateTag(tagName, data)
  }

  handleDelete () {
    alert('Not implemented')
  }
}

export default Tag
