const mongoose = require("mongoose");

const global = require('../const.js')
const { Video } = require("../model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

const UserClass = require("../user/user")
var user = new UserClass()

class VideoInterationClass {
  constructor(){}

  addLike(idVideo, idUser) {
    let query = {id: idVideo}
    // aggiungo +1 al contatore dei mi piace
    let set = { $inc: {
      like: 1,
      value: global.INCREMENT_VALUE_BY_LIKE
    }}
    Video.updateOne(query, set, (err, res) => {
      err ? console.log(err) : user.videoLiked(idVideo, idUser)
    })
  }
  
  share(idVideo, idUser) {
    let query = {id: idVideo}
    // aggiungo +1 al contatore delle condivisioni
    let set = { $inc: {
      share: 1,
      value: global.INCREMENT_VALUE_BY_SHARE
    }}
    Video.updateOne(query, set, (err, res) => {
      err ? console.log(err) : user.videoShared(idVideo, idUser)
    })
  }
  
  addComment(idVideo, idUser) {
    let query = {id: idVideo}
    // aggiungo +1 al contatore dei commenti
    let set = { $inc: {
      comments: 1,
      value: global.INCREMENT_VALUE_BY_COMMENT
    }}
    Video.updateOne(query, set, (err, res) => {
      err ? console.log(err) : user.videoCommented(idVideo, idUser)
    })
  }

  chooseRange(percentage) {
    let valueToIncrement
    if (percentage < global.POINTBREAK_TIME_WATCH_1) {
      //meno di 50%
      valueToIncrement = global.INCREMENT_VALUE_1_POINTBREAK
    } else if (percentage >= global.POINTBREAK_TIME_WATCH_1 && percentage < global.POINTBREAK_TIME_WATCH_2) {
      //tra 50 e 69
      valueToIncrement = global.INCREMENT_VALUE_2_POINTBREAK
    } else if (percentage >= global.POINTBREAK_TIME_WATCH_2 && percentage < global.POINTBREAK_TIME_WATCH_3) {
      //tra 70 e 89
      valueToIncrement = global.INCREMENT_VALUE_3_POINTBREAK
    } else if (percentage >= global.POINTBREAK_TIME_WATCH_3 && percentage < global.POINTBREAK_TIME_WATCH_4) {
      //tra 90 e 100
      valueToIncrement = global.INCREMENT_VALUE_4_POINTBREAK
    } else {
      valueToIncrement = 0
    }
    return valueToIncrement
  }

  feedbackTimeWatched(idVideo, idUser, percentage) {
    let valueToIncrement = this.chooseRange(percentage)
    let query = {id: idVideo}
    // aggiungo +1 al contatore delle visualizzazioni
    let set = { $inc: {
      views: 1,
      value: valueToIncrement
    }}
    Video.updateOne(query, set, (err, res) => {
      err ? console.log(err) : user.videoWatched(idVideo, idUser, valueToIncrement)
    })
  }
}
module.exports = VideoInterationClass