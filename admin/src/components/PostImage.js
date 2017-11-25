/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Container, Form, FormGroup, Label, Col, Row, Input } from 'reactstrap'

import * as PostApi from '../api/post'
import * as PostImageApi from '../api/post-image'

export class PostImage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: {
        category: {},
        content: '',
        date: null,
        heroImage: '',
        intro: '',
        slug: '',
        state: '',
        tags: [],
        title: '',
        _id: ''
      },
      images: [],
      file: '',
      filename: '',
      previewSrc: ''
    }
  }

  componentDidMount () {
    this.fetchPost(this.props.match.params.postSlug)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchPost(nextProps.match.params.postSlug)
  }

  render () {
    return (
      <div className="PostImage">
        <Container className="content">

          <div className="post-info">
            <Form className="border">
              <FormGroup row>
                <Label for="idText" sm={3}>Post Id</Label>
                <Col sm={9}>
                  <Input type="text" name="_id" id="idText" disabled value={this.state.post._id}></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="slugText" sm={3}>Post slug</Label>
                <Col sm={9}>
                  <Input type="text" name="slug" id="slugText" disabled value={this.state.post.slug}></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="titleText" sm={3}>Post title</Label>
                <Col sm={9}>
                  <Input type="text" name="title" id="titleText" disabled value={this.state.post.title}></Input>
                </Col>
              </FormGroup>
            </Form>
          </div>

          <div className="image-upload">
            <Form className="border">
              <Row>
                <Col xs={7}>
                  <FormGroup row>
                    <Label for="filenameText" sm={3}>File name</Label>
                    <Col sm={9}>
                      <Input type="text" name="filename" id="filenameText"
                        value={this.state.filename}
                        onChange={(e) => this.setState({filename: e.target.value})}>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="imageFile">File</Label>
                    <Input type="file" name="file" id="imageFile" accept="image/*"
                      ref={(ref) => { this.fileUpload = ref }}
                      onChange={(e) => this.handleUploadChange(e)} />
                  </FormGroup>
                  <Button outline color="dark"
                    onClick={(e) => this.handleUpload(e)}>
                    Upload
                  </Button>
                </Col>
                <Col xs={5}>
                  <img className="img-thumbnail" alt=""
                    src={this.state.previewSrc}
                    ref={(ref) => { this.preview = ref }}></img>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="images">
          </div>

        </Container>
      </div>
    )
  }

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  async fetchPost (postSlug) {
    const res = await PostApi.getPost(postSlug)
    // res.post.date = res.post.date ? new Date(res.post.date) : null
    this.setState({ post: res.post })
  }

  async fetchImages (postSlug) {
    // TODO
  }

  async uploadImage (file, filename, metadata = {}) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('metadata', JSON.stringify(metadata))
    const res = PostImageApi.uploadImage(this.props.match.params.postSlug, formData)
    console.log(res)
    this.fetchImages()
  }

  handleUploadChange (e) {
    e.preventDefault()
    let reader = new FileReader()
    let file = e.target.files[0] // { name. size, type, lastModified, lastModifiedDate }
    this.setState({filename: file.name})
    reader.onloadend = () => {
      this.setState({
        file: file,
        previewSrc: reader.result
      })
    }
    reader.readAsDataURL(file)
  }

  handleUpload (e) {
    if (!this.state.file) {
      return
    }
    this.uploadImage(this.state.file, this.state.filename)
  }
}

export default PostImage
