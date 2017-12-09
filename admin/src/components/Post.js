/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import MarkdownIt from 'markdown-it'
import MarkdownItReplaceLink from 'markdown-it-replace-link'
import TabOverride from 'taboverride'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import config from '../config'

import * as PostApi from '../api/post'
import * as CategoryApi from '../api/category'
import * as TagApi from '../api/tag'

export class Post extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      categories: [],
      post: {
        category: {},
        content: '',
        date: new Date(),
        heroImage: '',
        intro: '',
        slug: '',
        publish: false,
        tags: [],
        title: '',
        _id: ''
      }
    }
  }

  componentWillMount () {
    this.fetchCategories()
    this.fetchTags()
    this.fetchPost(this.props.match.params.postSlug)
    const postSlug = this.props.match.params.postSlug
    this.absoluteReg = new RegExp('^(?:[a-z]+:)?//', 'i')
    this.md = new MarkdownIt({
      // TODO: May not working as expected in some cases.
      replaceLink: (link, env) => {
        if (this.absoluteReg.test(link)) {
          return link
        }
        if (link.startsWith('/')) {
          return link
        }
        // return `${config.apiUrl}/posts/${postSlug}/${link}`
        return `/posts/${this.state.post.slug}/${link}`
      }
    })
    this.md.use(MarkdownItReplaceLink)
  }

  componentWillReceiveProps (nextProps) {
    this.fetchCategories()
    this.fetchTags()
    this.fetchPost(nextProps.match.params.postSlug)
  }

  componentDidMount () {
    TabOverride.set(this.postWriting, 4) // 4 spaces for tab
    TabOverride.autoIndent()
  }

  render () {
    return (
      <div className="Post content">
        <div className="post-settings">
          <Form>
            <FormGroup>
              <Label for="idText">id</Label>
              <Input type="text" name="id" id="idText" disabled
                value={this.state.post._id}
                onChange={(e) => { this.mergeAndSetState('post', '_id', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="slugText">slug</Label>
              <Input type="text" name="slug" id="slugText"
                value={this.state.post.slug}
                onChange={(e) => { this.mergeAndSetState('post', 'slug', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="titleText">title</Label>
              <Input type="text" name="title" id="titleText"
                value={this.state.post.title}
                onChange={(e) => { this.mergeAndSetState('post', 'title', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="heroImageText">hero image</Label>
              <Input type="text" name="heroImage" id="heroImageText"
                value={this.state.post.heroImage}
                onChange={(e) => { this.mergeAndSetState('post', 'heroImage', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="introText">intro</Label>
              <Input type="textarea" name="intro" id="introText"
                value={this.state.post.intro}
                onChange={(e) => { this.mergeAndSetState('post', 'intro', e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categorySelect">date</Label>
              <Datetime
                value={this.state.post.date}
                onChange={(datetime) => this.mergeAndSetState('post', 'date', datetime)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categorySelect">category</Label>
              <Select
                name={'category'}
                value={this.state.post.category ? this.state.post.category.slug : null}
                onChange={(valueLabel) => this.handleCategorySelectChange(valueLabel)}
                options={this.categoryOptions}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tagSelect">tags</Label>
              <Select
                name={'tags'}
                multi={true}
                value={this.state.post.tags.map(tag => tag.slug)}
                onChange={(valueLabel) => this.handleTagSelectChange(valueLabel)}
                options={this.tagOptions}
              />
            </FormGroup>
            <FormGroup check>
              <Label check for="publishCheck">
                <Input type="checkbox" id="publishCheck"
                  checked={this.state.post.publish}
                  value={this.state.post.publish}
                  onChange={(e) => this.mergeAndSetState('post', 'publish', e.target.checked)}
                />
                publish
              </Label>
            </FormGroup>
            <hr/>
            <Button block outline color="primary" onClick={() => this.handleSave()}>Save</Button>
            <Button block outline color="dark"
              onClick={() => { this.props.history.push(`/posts/${this.state.post.slug}/images`) }}>
              Images
            </Button>
            <Button block outline color="danger" onClick={() => this.handleDelete()}>Delete</Button>
          </Form>
        </div>

        <div className="post-editor">
          <textarea className="post-writing" name="content"
            ref={(input) => { this.postWriting = input }}
            value={this.state.post.content}
            onChange={(e) => { this.mergeAndSetState('post', 'content', e.target.value) }}
          />
          <div className="post-preview markdown-body"
            dangerouslySetInnerHTML={{__html: this.markdownedContent}}
          >
          </div>

        </div>
      </div>
    )
  }

  mergeAndSetState (field, key, val) {
    const data = this.state[field]
    data[key] = val
    this.setState({[field]: data})
  }

  get markdownedContent () {
    return this.md.render(this.state.post.content)
  }

  get categoryOptions () {
    return this.state.categories.map(category => {
      return { value: category.slug, label: category.name }
    })
  }

  get tagOptions () {
    return this.state.tags.map(tag => {
      return { value: tag.slug, label: tag.name }
    })
  }

  get categoriesBySlug () {
    const obj = {}
    this.state.categories.forEach(category => {
      obj[category.slug] = category
    })
    return obj
  }

  get tagsBySlug () {
    const obj = {}
    this.state.tags.forEach(tag => {
      obj[tag.slug] = tag
    })
    return obj
  }

  async fetchPost (postSlug) {
    const res = await PostApi.getPost(postSlug)
    res.post.date = res.post.date ? new Date(res.post.date) : null
    this.setState({ post: res.post })
  }

  async fetchTags () {
    const res = await TagApi.getTags()
    this.setState({ tags: res.tags })
  }

  async fetchCategories () {
    const res = await CategoryApi.getCategories()
    this.setState({ categories: res.categories })
  }

  async updatePost (postSlug, data) {
    data = Object.assign({}, data)
    delete data._id
    data.category = data.category ? data.category._id : null
    data.tags = data.tags.map(tag => tag._id)
    const res = await PostApi.updatePost(postSlug, data)
    alert('Saved.')
    this.props.history.replace(`/posts/${res.post.slug}`)
  }

  async deletePost (postSlug) {
    const res = await PostApi.deletePost(postSlug)
    this.props.history.push(`/posts`)
  }

  handleCategorySelectChange (valueLabel) {
    this.mergeAndSetState('post', 'category', valueLabel ? this.categoriesBySlug[valueLabel.value] : null)
  }

  handleTagSelectChange (valueLabels) {
    const postTags = valueLabels.map(valueLabel => this.tagsBySlug[valueLabel.value])
    this.mergeAndSetState('post', 'tags', postTags)
  }

  handleSave () {
    const postSlug = this.props.match.params.postSlug
    if (!window.confirm('Confirm to update?')) {
      return
    }
    const data = this.state.post
    this.updatePost(postSlug, data)
  }

  handleDelete () {
    const postSlug = this.props.match.params.postSlug
    if (window.prompt(`Input the slug '${postSlug}' to delete the post`) !== postSlug) {
      alert(`Input the slug '${postSlug}' to delete the post`)
      return
    }
    this.deletePost(postSlug)
  }
}

export default Post
