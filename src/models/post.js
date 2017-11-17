import { Model } from '~/models/index'
import Category from '~/models/category' // eslint-disable-line no-unused-vars
import Tag from '~/models/tag' // eslint-disable-line no-unused-vars

const MODEL_NAME = 'Post'
const COLL_NAME = 'posts'

export class Post extends Model {

}

Post.MODEL_NAME = MODEL_NAME
Post.COLL_NAME = COLL_NAME

export default Post
