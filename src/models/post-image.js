import { FileModel } from '~/models/index'

const BUCKET_NAME = 'posts.images'

export class PostImage extends FileModel {

}

PostImage.BUCKET_NAME = BUCKET_NAME

export default PostImage
