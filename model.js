const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const global = require('./const.js')

const videoModel = new Schema({
  id: { type: String, required: true },
  category: { type: Number, required: true},
  value: { type: Number, default: 0},
  dateAdded: { type: Number, default: new Date().getTime() },
  hypeExpires: { type: Number },
  like: { type: Number, default:0},
  comments: { type: Number, default:0},
  share: { type: Number, default:0},
  videoDuration: {type: Number, required: true},
  views : {type: Number, default:0},
  author : {type: Number, default:0}
})

const userModel = new Schema({
  id: { type: String, required: true },
  favouriteCategories: { type: Array, required: true },
  likedVideos: {type: Array, default:[]},
  sharedVideos: {type: Array, default:[]},
  commentedVideos: {type: Array, default:[]},
  authorsWatched: {type: Array, default:[]}
})

var Video = mongoose.model('VideoModel', videoModel, global.COLLECTION_NAME_VIDEO)
var User = mongoose.model('UserModel', userModel, global.COLLECTION_NAME_PROFILATION)

module.exports = {
  Video: Video,
  User: User
}