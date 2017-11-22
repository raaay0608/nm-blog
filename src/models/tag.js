import { Model } from '~/models/index'
import Post from './post'

const MODEL_NAME = 'Tag'
const COLL_NAME = 'tags'

/*
 * slug {string} - required, unique, index
 * name {string} - required, unique, index
 */

class Tag extends Model {
  static async delete (filter) {
    // TODO: cannot pull
    const tag = await this.get(filter)
    const posts = await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } })
    const tagData = await super.delete(filter)
    return {
      tag: tagData,
      posts: posts
    }
  }
}

Tag.MODEL_NAME = MODEL_NAME
Tag.COLL_NAME = COLL_NAME

export default Tag
