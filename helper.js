const mongoose = require("mongoose");

const global = require('./const.js')
const { Video } = require("./model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

module.exports = class Helper {

  async getIdAuthor(idVideo) {
    // ritorno l'identificativo del canale del video
    let fieldsToReturn = {
      author: true,
      _id: false
    }
    let query = {
      id: idVideo
    }
    var findAuthor = new Promise((resolve, reject) => {
      Video.findOne(query, fieldsToReturn, (err, res) => {
        if (res){
          resolve(res.author)
        } else {
          reject(true)
        }
      })
    })
    return await findAuthor
  }

  async getIdCategory(idVideo) {
    // ritorno l'identificativo della categoria del video
    let fieldsToReturn = {
      category: true,
      _id: false
    }
    let query = {
      id: idVideo
    }
    var findCategory = new Promise((resolve, reject) => {
      Video.findOne(query, fieldsToReturn, (err, res) => {
        if (res){
          resolve(res.category)
        } else {
          reject(true)
        }
      })
    })
    return await findCategory
  }

  async getDurationVideo(idVideo){
    // ritorno la durata del video 
    let query = { id: idVideo }
    let fieldsToReturn = {
      videoDuration: true,
      _id: false
    }
    let duration
    var getDuration = new Promise((resolve, reject) => {
      Video.findOne(query, fieldsToReturn, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          duration = res.videoDuration
        }
        resolve(true)
      })
    })
    await getDuration
    return parseInt(duration)
  }

}
