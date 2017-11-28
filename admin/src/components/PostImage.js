/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Container, Form, FormGroup, Label, Col, Row, Input,
  Card, CardHeader, CardBody } from 'reactstrap'

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
    this.fetchImages(this.props.match.params.postSlug)
  }

  // componentWillReceiveProps (nextProps) {
  //   this.fetchPost(nextProps.match.params.postSlug)
  //   this.fetchImages(this.props.match.params.postSlug)
  // }

  render () {
    return (
      <div className="PostImage">
        <Container className="content">

          <div className="post-info">
            <Card>
              <Form>
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
            </Card>
          </div>

          <div className="image-upload">
            <Card color="light">
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
                    <Button color="dark"
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
            </Card>
          </div>

          <div className="images">
            {this.state.images.map((image, index) =>
              <Card key={image._id} color="light">
                <CardHeader>
                  {image.metadata.filename}
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <Form>
                        <FormGroup>
                          <Label for={`image-id-${image._id}`}>_id</Label>
                          <Input id={`image-id-${image._id}`} type="text" value={image._id} disabled name="_id"></Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for={`image-filename-${image._id}`}>filename</Label>
                          <Input id={`image-filename-${image._id}`} type="text" name="filename"
                            value={image.metadata.filename}
                            onChange={(e) => {
                              image.name = e.target.value
                              this.forceUpdate()
                            }}>
                          </Input>
                        </FormGroup>
                        <Button color="dark">Update</Button>&nbsp;
                        <Button color="danger">Delete</Button>
                        {/* TODO */}
                      </Form>
                    </Col>
                    <Col>
                      <img src={'http://localhost:8000' + image.url}
                        className="img-fluid img-thumbnail"
                        alt={image.metadata.filename}>
                      </img>
                      {/* TODO */}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
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
    const res = await PostImageApi.getImages(postSlug)
    this.setState({ images: res.images })
  }

  async uploadImage (file, filename, metadata = {}) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)
    formData.append('metadata', JSON.stringify(metadata))
    const res = PostImageApi.uploadImage(this.props.match.params.postSlug, formData)
    this.fetchImages(this.props.match.params.postSlug)
    this.setState({file: ''})
    this.setState({filename: ''})
    this.setState({previewSrc: ''})
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
