const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    collections: ['TO LEARN', 'LEARNING', 'LEARNED'],
  },
  url: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  }
})

module.exports = mongoose.model('posts', PostSchema)
