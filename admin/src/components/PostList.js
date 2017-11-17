/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import * as PostApi from '../api/post'

export class Index extends Component {
  constructor (props) {
    super(props)
    this.state = { posts: [] }
  }

  componentWillMount () {
    this.fetchPosts()
  }

  render () {
    return (
      <div className="PostList">
        <div className="container">
          <table className="table">
            <caption>List of posts</caption>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map((post) =>
                <tr key={post._id}>
                  <th scope="row">{post._id}</th>
                  <td>{post.title}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  fetchPosts () {
    let posts = PostApi.getPosts()
      .then(posts => {
        this.setState({posts: posts})
      })
      .catch(err => {
        alert(err)
        console.error(err)
      })
  }
}

export default Index
