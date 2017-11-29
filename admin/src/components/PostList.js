/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter,
  Table, Form, FormGroup, Label, Col, Input } from 'reactstrap'

import * as PostApi from '../api/post'

export class PostList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: [], // {slug, title, heroImage, intro, content, category, tags, state, date}
      newPost: {
        slug: '',
        title: ''
        // heroImage: '',
        // intro: '',
        // content: '',
        // category: null,
        // tags: [],
        // state: 'draft',
        // date: new Date()
      },
      modal: false
    }
  }

  componentWillMount () {
    this.fetchPosts()
  }

  render () {
    return (
      <div className="PostList">
        <div className="container content">

          <div className="button-area">
            <Button block onClick={() => this.toggleModal()}>New Post</Button>
          </div>

          <Table hover>
            <caption>list of posts</caption>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map((post) =>
                <tr key={post.slug} onClick={() => this.props.history.push(`/posts/${post.slug}`)}>
                  <th scope="row">{post._id}</th>
                  <td>{post.title}</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal isOpen={ this.state.modal }>
            <ModalHeader toggle={() => this.toggleModal()}>
              New Post
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="slugText">slug</Label>
                  <Input type="text" name="slug" id="slugText"
                    value={this.state.newPost.slug}
                    onChange={(e) => { this.mergeAndSetState('newPost', 'slug', e.target.value) }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="titleText">title</Label>
                  <Input type="text" name="title" id="titleText"
                    value={this.state.newPost.name}
                    onChange={(e) => { this.mergeAndSetState('newPost', 'title', e.target.value) }}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button outline color="primary" onClick={() => this.handleCreate()}>Create</Button>
              <Button outline color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    )
  }

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  async fetchPosts () {
    try {
      const data = await PostApi.getPosts()
      this.setState({posts: data.posts})
    } catch (err) {
      alert(err)
    }
  }

  async createPost (data) {
    try {
      const res = await PostApi.createPost(data)
      this.props.history.push(`/posts/${res.post.slug}`)
    } catch (err) {
      alert(err)
    }
  }

  toggleModal () {
    this.setState({
      modal: !this.state.modal
    })
  }

  handleCreate () {
    const data = this.state.newPost
    this.createPost(data)
  }
}

export default PostList
