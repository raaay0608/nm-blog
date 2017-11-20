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
      tags: [], // { _id, name }
      newTagName: '',
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
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tags.map((tag) =>
                <tr key={tag._id}>
                  <th scope="row">{tag._id}</th>
                  <td><Link to={`/tags/${tag.name}`}>{tag.name}</Link></td>
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
                  <Label for="nameText">Name</Label>
                  <Input type="text" name="name" id="nameText"
                    value={this.state.newTagName}
                    onChange={(e) => this.setState({ newTagName: e.target.value })}
                  />
                </FormGroup>
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button color="dark" onClick={() => this.handleCreate()}>Create</Button>
              <Button color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    )
  }

  async fetchTags () {
    try {
      const data = await TagApi.getTags()
      this.setState({ tags: data.tags })
    } catch (err) {
      alert(err)
    }
  }

  async createNewTag () {
    try {
      const data = { name: this.state.newTagName }
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
    this.createNewTag()
  }
}

export default Tag
