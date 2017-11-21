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
        slug: '',
        name: ''
      }
    }
  }

  componentWillMount () {
    this.fetchTag(this.props.match.params.tagSlug)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchTag(nextProps.match.params.tagSlug)
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
              <Label for="slugText">Slug</Label>
              <Input type="text" name="slug" id="slugText"
                value={this.state.tag.slug}
                onChange={(e) => { this.mergeAndSetState('tag', 'slug', e.target.value) }}
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

  async fetchTag (tagSlug) {
    try {
      const res = await TagApi.getTag(tagSlug)
      this.setState({tag: res.tag})
    } catch (err) {
      alert(err)
    }
  }

  async updateTag (tagSlug, data) {
    try {
      const res = await TagApi.updateTag(tagSlug, data)
      const newTagSlug = res.tag.slug
      this.props.history.push(`/tags/${newTagSlug}`)
    } catch (err) {
      alert(err)
    }
  }

  async deleteTag (tagSlug) {
    try {
      const res = await TagApi.deleteTag(tagSlug)
      this.props.history.push(`/tags`)
    } catch (err) {
      alert(err)
    }
  }

  handleSave () {
    if (!window.confirm('Confirm to update ?')) {
      return
    }
    const tagSlug = this.props.match.params.tagSlug
    const data = this.state.tag
    delete data['_id']
    this.updateTag(tagSlug, data)
  }

  handleDelete () {
    const tagSlug = this.props.match.params.tagSlug
    if (window.prompt(`Input tag slug "${tagSlug}" to delete it`) !== tagSlug) {
      alert(`Input the currect tag slug "${tagSlug}" to delete it`)
      return
    }
    this.deleteTag(tagSlug)
  }
}

export default Tag
