const mongoose = require("mongoose");

const global = require('../const.js')
const { Video } = require("../model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

const UserClass = require("../user/user")
const Helper = require("../helper")
var user = new UserClass()
var helper = new Helper()

class VideoInterationClass {
  constructor(){}

  addLike(idVideo, idUser) {
    let query = { id: idVideo }
    // aggiungo +1 al contatore dei mi piace
    let set = { $inc: {
      like: 1,
      value: global.INCREMENT_VALUE_BY_LIKE
    }}
    try {
      Video.updateOne(query, set, (err, res) => {
        if (err) throw(err)
        user.videoLiked(idVideo, idUser)
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  share(idVideo, idUser) {
    let query = { id: idVideo }
    // aggiungo +1 al contatore delle condivisioni
    let set = { $inc: {
      share: 1,
      value: global.INCREMENT_VALUE_BY_SHARE
    }}
    try {
      Video.updateOne(query, set, (err, res) => {
        if (err) throw(err)
        user.videoShared(idVideo, idUser)
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  addComment(idVideo, idUser) {
    let query = {id: idVideo}
    // aggiungo +1 al contatore dei commenti
    let set = { $inc: {
      comments: 1,
      value: global.INCREMENT_VALUE_BY_COMMENT
    }}
    try {
      Video.updateOne(query, set, (err, res) => {
        if (err) throw(err)
        user.videoCommented(idVideo, idUser)
      })
    } catch(error) {
      console.log(error)
    }
  }

  feedbackTimeWatched(idVideo, idUser, percentage) {
    let valueToIncrement = helper.chooseRange(percentage)
    let query = { id: idVideo }
    // aggiungo +1 al contatore delle visualizzazioni
    let set = { $inc: {
      views: 1,
      value: valueToIncrement
    }}
    try {
      Video.updateOne(query, set, (err, res) => {
        if (err) throw(err)
        user.videoWatched(idVideo, idUser, valueToIncrement)
      })
    } catch(error) {
      console.log(error)
    }
    
  }
}
module.exports = VideoInterationClass