/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Table } from 'reactstrap'
import * as CategoryApi from '../api/category'

export class CategoryList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: [] // { _id, name, description, preference }
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
            <Button block>New Category</Button>
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

        </div>
      </div>
    )
  }

  fetchCategories () {
    CategoryApi.getCategories()
      .then(categories => {
        this.setState({categories: categories})
      })
      .catch(err => {
        alert(err)
      })
  }
}

export default CategoryList
