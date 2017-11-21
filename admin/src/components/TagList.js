/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter,
  Table, Form, FormGroup, Label, Col, Input } from 'reactstrap'
import * as TagApi from '../api/tag'

export class Tag extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [], // { _id, slug, name }
      newTag: {
        slug: '',
        name: ''
      },
      modal: false
    }
  }

  componentWillMount () {
    this.fetchTags()
  }

  render () {
    return (
      <div className="CategoryList">
        <div className="container content">

          <div className="button-area">
            <Button block onClick={() => this.toggleModal()}>New Tag</Button>
          </div>

          <Table>
            <caption>List of tags</caption>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Slug</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tags.map((tag) =>
                <tr key={tag._id}>
                  <Link to={`/tags/${tag.slug}`}>
                    <th scope="row">{tag._id}</th>
                    <td>{tag.slug}</td>
                    <td>{tag.name}</td>
                  </Link>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()}>
            <ModalHeader toggle={() => this.toggleModal()}>
              New Tag
            </ModalHeader>

            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="slugText">Slug</Label>
                  <Input type="text" name="slug" id="slugText"
                    value={this.state.newTag.slug}
                    onChange={(e) => this.mergeAndSetState('newTag', 'slug', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="nameText">Name</Label>
                  <Input type="text" name="name" id="nameText"
                    value={this.state.newTag.name}
                    onChange={(e) => this.mergeAndSetState('newTag', 'name', e.target.value)}
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

  async fetchTags () {
    try {
      const data = await TagApi.getTags()
      this.setState({ tags: data.tags })
    } catch (err) {
      alert(err)
    }
  }

  async createNewTag (data) {
    try {
      const resData = await TagApi.createTag(data)
      this.fetchTags()
      this.toggleModal()
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
    const data = this.state.newTag
    this.createNewTag(data)
  }
}

export default Tag
