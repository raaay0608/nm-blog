/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter,
  Table, Form, FormGroup, Label, Col, Input } from 'reactstrap'
import * as CategoryApi from '../api/category'

export class CategoryList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      categories: [], // { _id, name, description, preference }
      newCategory: {
        name: '',
        description: '',
        preference: 0
      },
      modal: false
    }
  }

  componentWillMount () {
    this.fetchCategories()
  }

  render () {
    return (
      <div className="CategoryList">
        <div className="container content">

          <div className="button-area">
            <Button block onClick={() => this.toggleModal()}>New Category</Button>
          </div>

          <Table>
            <caption>List of categories</caption>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Preference</th>
              </tr>
            </thead>
            <tbody>
              {this.state.categories.map((category) =>
                <tr key={category._id}>
                  <th scope="row">{category._id}</th>
                  <td>{category.name}</td>
                  <td>{category.preference}</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()}>
            <ModalHeader toggle={() => this.toggleModal()}>
              New Category
            </ModalHeader>

            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="nameText">Name</Label>
                  <Input type="text" name="name" id="nameText"
                    value={this.state.newCategory.name}
                    onChange={(e) => { this.mergeAndSetState('newCategory', 'name', e.target.value) }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="preferenceText">Preference</Label>
                  <Input type="number" name="preference" id="preferenceNumnber"
                    value={this.state.newCategory.preference}
                    onChange={(e) => { this.mergeAndSetState('newCategory', 'preference', Number(e.target.value)) }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="descriptionTextArea">Description</Label>
                  <Input type="textarea" name="description" id="descriptionTextArea"
                    value={this.state.newCategory.description}
                    onChange={(e) => { this.mergeAndSetState('newCategory', 'description', e.target.value) }}
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

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  async fetchCategories () {
    try {
      const data = await CategoryApi.getCategories()
      this.setState({categories: data.categories})
    } catch (err) {
      alert(err)
    }
  }

  async createNewCategory () {
    try {
      const data = this.state.newCategory
      const resData = await CategoryApi.createCategory(data)
      this.fetchCategories()
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
    this.createNewCategory()
  }
}

export default CategoryList
