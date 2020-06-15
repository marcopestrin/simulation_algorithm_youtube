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
    try {
      var findAuthor = new Promise((resolve, reject) => {
        Video.findOne(query, fieldsToReturn, (err, res) => {
          if(err) throw(err)
          resolve(res.author)
        })
      })
      return await findAuthor
    } catch (error) {
      console.log(error)
    }
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
    try {
      var findCategory = new Promise((resolve, reject) => {
        Video.findOne(query, fieldsToReturn, (err, res) => {
          if(err) throw(err)
          resolve(res.category)
        })
      })
      return await findCategory
    } catch (error) {
      console.log(error) 
    }
  }

  async getDurationVideo(idVideo){
    // ritorno la durata del video 
    let query = { id: idVideo }
    let fieldsToReturn = {
      videoDuration: true,
      _id: false
    }
    let duration
    try {
      var getDuration = new Promise((resolve, reject) => {
        Video.findOne(query, fieldsToReturn, (err, res) => {
          if(err) throw(err)
          duration = res.videoDuration
          resolve(true)
        })
      })
      await getDuration
      return parseInt(duration)
    } catch(error) {
      console.log(error)
    }
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

  channelExist(listChannels, author) {
    // la funziona controlla se il dato è presente nell'array
    for(var i = 0; i < listChannels.length; i++) {
      if (listChannels[i].channel === author) {
        return true
      }
    }
    return false
  }

  categoryExist(listCategories, category) {
    // la funziona controlla se il dato è presente nell'array
    for(var i = 0; i < listCategories.length; i++) {
      if (listCategories[i].category === category) {
        return true
      }
    }
    return false
  }

  getImpactValue(action, duration) {
    // calcolo del valore d'impatto che ha l'azione
    let impact = 1
    if (action === global.ID_ACTION_TIME_WATCH) {
      impact =  duration * global.WEIGHT_TIME_WATCH_IN_BEST_CAT
    }
    if (action === global.ID_ACTION_COMMENT) {
      impact = global.WEIGHT_COMMENT_IN_BEST_CAT
    }
    if (action === global.ID_ACTION_SHARE) {
      impact = global.WEIGHT_SHARE_IN_BEST_CAT
    }
    if (action === global.ID_ACTION_LIKE) {
      impact = global.WEIGHT_LIKE_IN_BEST_CAT
    }
    return impact
  }

  async getVideosByCategory(category) {
    // ritorno i video di una determinata categoria
    try {
      var videos = new Promise((resolve, reject) => {
        Video.find({category}).lean(true).exec((err, res) => {
          if(err) throw(err) 
          resolve(res)
        })
      })
      return await videos
    } catch (error) {
      console.log(error)
    }
  }
  
  async getVideosByChannel(author) {
    // ritorno i video di una determinato autore/canale
    try {
      var videos = new Promise((resolve, reject) => {
        Video.find({author}).lean(true).exec((err, res) => {
          if(err) throw(err) 
          resolve(res)
        })
      })
      return await videos
    } catch (error) {
      console.log(error)
    }
  }
}
