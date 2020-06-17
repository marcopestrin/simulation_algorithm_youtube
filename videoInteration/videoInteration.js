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

  async isEmptycollection() {
    try {
      let result
      var check = new Promise((resolve, reject) => {
        Video.find().exec((err, res) =>{
          if (err) throw (err)
          if (res) {
            result = res.length === 0
            resolve(true)
          }
        })
      })
      await check
      return result
    }catch(error) {
      console.log(error)
    }
  }

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

  async refreshHype(req, res) {
    // quando l'hype è finito flaggo il campo a 0
    let query = {
      hypeExpires: {
        $lt: Math.floor(Date.now() / 1000)
      }
    }
    let set = {
      $set: {
        hypeExpires: 0
      }
    }
    try {
      var refreshed = new Promise((resolve, reject) => {
        Video.updateMany(query, set, (err, res) => {
          if (err) throw(err)
          if (res) resolve(res)
        })
      })
      res.send(await refreshed)
    } catch(error) {
      console.log(error)
      return error
    }
  }

  async isViral(req, res){
    const { idVideo, idUser } = req.body
    // se arriva a 100 prima che l'hype finisca
    let query = {
        value: {
          $gt: global.POINTBREAK_VIRAL
        },
        hypeExpires: {
          $gt: 1
        },
        id: idVideo
    }
    try {
      var isViral = new Promise((resolve, reject) => {
        Video.find(query, (err, res) => {
          if (err) throw(err)
          if (res) resolve(res)
        })
      })
      res.send(await isViral)
    } catch(error) {
      console.log(error)
      return error
    }
  }
}
module.exports = VideoInterationClass