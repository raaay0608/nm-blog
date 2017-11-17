import { Model } from '~/models/index' // eslint-disable-line no-unused-vars

const MODEL_NAME = 'Tag' // eslint-disable-line no-unused-vars
const COLL_NAME = 'tags' // eslint-disable-line no-unused-vars

/*
 * name {string} - required, unique, index
 */

class Tag extends Model {

}

Tag.MODEL_NAME = MODEL_NAME
Tag.COLL_NAME = COLL_NAME

export default Tag
