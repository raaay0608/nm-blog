/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import * as TagApi from '../api/tag'

export class Tag extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tags: [] // { _id, name }
    }
  }

  componentWillMount () {
    this.fetchTags()
  }

  render () {
    return (
      <div className="CategoryList">
        <div className="container">

          <table className="table">
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
                  <td>{tag.name}</td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      </div>
    )
  }

  fetchTags () {
    TagApi.getTags()
      .then(tags => {
        this.setState({tags: tags})
      })
      .catch(err => {
        alert(err)
      })
  }
}

export default Tag
