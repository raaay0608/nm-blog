/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import MarkdownIt from 'markdown-it'
import TabOverride from 'taboverride'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import * as PostApi from '../api/post'

export class Post extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: {
        category: {},
        content: '',
        date: new Date(),
        heroImage: '',
        intro: '',
        slug: '',
        state: '',
        tags: [],
        title: '',
        _id: ''
      }
    }
    this.md = new MarkdownIt()
  }

  componentWillMount () {
    this.fetchPost(this.props.match.params.postSlug)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchPost(this.props.match.params.postSlug)
  }

  componentDidMount () {
    TabOverride.set(this.postWriting, 4) // 4 spaces for tab
    TabOverride.autoIndent()
  }

  render () {
    return (
      <div className="Post content">
        <div className="post-settings">
          <Form>
            <FormGroup>
              <Label for="idText">id</Label>
              <Input type="text" name="id" id="idText" disabled
                value={this.state.post._id}
                onChange={(e) => { this.mergeAndSetState('post', '_id', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="slugText">slug</Label>
              <Input type="text" name="slug" id="slugText"
                value={this.state.post.slug}
                onChange={(e) => { this.mergeAndSetState('post', 'slug', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="titleText">title</Label>
              <Input type="text" name="title" id="titleText"
                value={this.state.post.title}
                onChange={(e) => { this.mergeAndSetState('post', 'name', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categorySelect">date</Label>
              <Datetime
                value={this.state.post.date}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categorySelect">category</Label>
              <Select
                name="category"
                value={this.state.value}
                onChange={this.handleChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' }
                ]}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tagSelect">tags</Label>
              <Select
                name="tags"
                multi={true}
                value={{ value: 'one', label: 'One' }}
                onChange={this.handleChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' }
                ]}
              />
            </FormGroup>
          </Form>
        </div>

        <div className="post-editor">
          <textarea className="post-writing" name="content"
            ref={(input) => { this.postWriting = input }}
            value={this.state.post.content}
            onChange={(e) => { this.mergeAndSetState('post', 'content', e.target.value) }}
          />
          <div className="post-preview"
            dangerouslySetInnerHTML={{__html: this.markdownedContent}}
          >
          </div>

        </div>
      </div>
    )
  }

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  get markdownedContent () {
    return this.md.render(this.state.post.content)
  }

  async fetchPost (postSlug) {
    const res = await PostApi.getPost(postSlug)
    res.post.date = res.post.date ? new Date(res.post.date) : null
    this.setState({ post: res.post })
  }

  updatePost (postSlug, data) {

  }
}

export default Post
