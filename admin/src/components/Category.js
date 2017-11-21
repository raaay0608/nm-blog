/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import * as CategoryApi from '../api/category'

export class Category extends Component {
  constructor (props) {
    super(props)

    this.state = {
      category: {
        _id: '',
        name: '',
        preference: 0,
        description: ''
      }
    }
  }

  componentWillMount () {
    this.fetchCategory(this.props.match.params.categoryName)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchCategory(nextProps.match.params.categoryName)
  }

  render () {
    return (
      <div className="Category">
        <div className="container content">

          <Form>
            <FormGroup>
              <Label for="idText">ID</Label>
              <Input disabled type="text" name="id" id="idText"
                value={this.state.category._id}
                onChange={(e) => { this.mergeAndSetState('category', '_id', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="nameText">Name</Label>
              <Input type="text" name="name" id="nameText"
                value={this.state.category.name}
                onChange={(e) => { this.mergeAndSetState('category', 'name', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="idText">Preference</Label>
              <Input type="number" name="preference" id="preferenceNumnber"
                value={this.state.category.preference}
                onChange={(e) => { this.mergeAndSetState('category', 'preference', Number(e.target.value)) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="idText">Preference</Label>
              <Input type="textarea" name="description" id="descriptionTextArea"
                value={this.state.category.description}
                onChange={(e) => { this.mergeAndSetState('category', 'description', e.target.value) }}
              />
            </FormGroup>
            <hr/>
            <Button outline color="primary" onClick={() => this.handleSave()}>Save</Button>&nbsp;
            <Button outline color="danger" onClick={() => this.handleDelete()}>Delete</Button>
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

  async fetchCategory (categoryName) {
    const res = await CategoryApi.getCategory(categoryName)
    this.setState({category: res.category})
  }

  async updateCategory () {

  }

  handleSave () {
    alert('Not implemented')
  }

  handleDelete () {
    alert('Not implemented')
  }
}

export default Category
