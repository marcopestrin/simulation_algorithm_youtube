const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const global = require('./const.js')

const videoModel = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: Number, required: true },
  value: { type: Number, default: 0 },
  dateAdded: { type: Number, default: Math.floor(Date.now() / 1000) },
  hypeExpires: { type: Number, default: Math.floor(Date.now() / 1000) + global.HOURS_HYPE * 60 * 60 },
  like: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  share: { type: Number, default: 0 },
  videoDuration: { type: Number, required: true },
  views: { type: Number, default: 0 },
  author: { type: Number, default: 0 }
})

const userModel = new Schema({
  id: { type: Number, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  token: {type: String, default: '' },
  favouriteCategories: { type: Array, required: true },
  favouriteChannels: { type: Array, required: true },
  likedVideos: { type: Array, default: [] },
  sharedVideos: { type: Array, default: [] },
  commentedVideos: { type: Array, default: [] },
  authorsWatched: { type: Array, default: [] }
})

const categoryModel = new Schema({
  category: { type: Number, required: true },
  name: { type: String, required: true }
})

const authorModel = new Schema({
  author: { type: Number, required: true },
  name: { type: String, required: true }
})

var Video = mongoose.model('VideoModel', videoModel, global.COLLECTION_NAME_VIDEO)
var User = mongoose.model('UserModel', userModel, global.COLLECTION_NAME_PROFILATION)
var Author = mongoose.model('authorModel', authorModel, global.COLLECTION_NAME_AUTHOR)
var Category = mongoose.model('categoryModel', categoryModel, global.COLLECTION_NAME_CATEGORY)

module.exports = {
  Video: Video,
  User: User,
  Author: Author,
  Category: Category
}