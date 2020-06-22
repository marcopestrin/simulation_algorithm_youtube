const global = require('../const.js')
const user = require("../user/user")
const helper = require("../helper")
const { Video } = require("../model");

class VideoInterationClass {
  constructor(){}

  async addLike(req, res) {
    const { idVideo, idUser } = req.body
    let query = { id: idVideo }
    // aggiungo +1 al contatore dei mi piace
    let set = { $inc: {
      like: 1,
      value: global.INCREMENT_VALUE_BY_LIKE
    }}
    try {
      var likeAggiunto = new Promise((resolve, reject) => {
        Video.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          var result = {
            likeAggiunto: res,
            videoLiked: await user.videoLiked(idVideo, idUser)
          }
          resolve(result)
        })
      })
      res.send(await likeAggiunto)
    } catch (error) {
      console.log(error)
      return error
    }
  }
  
  async share(req, res) {
    const { idVideo, idUser } = req.body
    let query = { id: idVideo }
    // aggiungo +1 al contatore delle condivisioni
    let set = { $inc: {
      share: 1,
      value: global.INCREMENT_VALUE_BY_SHARE
    }}
    try {
      var videoCondiviso = new Promise((resolve, reject) => {
        Video.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          let result = {
            videoCondiviso: res,
            videoShared: await user.videoShared(idVideo, idUser)
          }
          resolve(result)
        })
      })
      res.send(await videoCondiviso)
    } catch (error) {
      console.log(error)
      return error
    }
  }
  
  async addComment(req, res) {
    const { idVideo, idUser } = req.body
    let query = {id: idVideo}
    // aggiungo +1 al contatore dei commenti
    let set = { $inc: {
      comments: 1,
      value: global.INCREMENT_VALUE_BY_COMMENT
    }}
    try {
      var commentoAggiunto = new Promise((resolve, reject) => {
        Video.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          var result = {
            commentoAggiunto: res,
            videoCommented: await user.videoCommented(idVideo, idUser)
          }
          resolve(result)
        })
      })
      res.send(await commentoAggiunto)
    } catch(error) {
      console.log(error)
      return error
    }
  }

  async feedbackTimeWatched(req, res) {
    const { idVideo, idUser, percentage } = req.body
    let valueToIncrement = helper.chooseRange(percentage)
    let query = { id: idVideo }
    // aggiungo +1 al contatore delle visualizzazioni
    let set = { $inc: {
      views: 1,
      value: valueToIncrement
    }}
    try {
      var riscontro = new Promise((resolve, reject) => {
        Video.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          let result = {
            riscontro: res,
            videoWatched: await user.videoWatched(idVideo, idUser, valueToIncrement)
          }
          resolve(result)
        })
      })
      res.send(await riscontro)
    } catch(error) {
      console.log(error)
      return error
    }
  }
  
  async getLastVideos(req, res) {
    // ritorno gli ultimi video aggiunti
    try {
      var videoList = new Promise((resolve, reject) => {
        Video.find({})
          .lean()
          .sort({ 'dateAdded': -1 })
          .limit(global.LIMIT_VIDEOS_HOMEPAGE)
          .exec((err, res) => {
            if(err) throw(err)
            resolve(res)
        })
      })
      res.send(await videoList)
    } catch (error) {
      console.log(error)
    }
  }
}

var interation = new VideoInterationClass()
module.exports = Object.freeze(interation)