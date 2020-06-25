const global = require('./const.js')
const { Video, User} = require("./model");
class Helper {


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
      res.json(await refreshed)
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
      res.json(await isViral)
    } catch(error) {
      console.log(error)
      return error
    }
  }
  async sortCategoriesByImpact(idUser) {
    let set = {
      $push: {
        favouriteCategories: {
          $each: [],
          $sort: { impact: -1 }
        }
      }
    }
    let query = { id: idUser}
    try {
      var ordinamentoPerImpatto = new Promise((resolve, reject) => {
        User.updateOne(query, set, (err, res) => {
          if (err) throw(err)
          resolve(res)
        })
      })
      return await ordinamentoPerImpatto
    } catch(err) {
      console.log(err)
    }
  }
  
  async sortChannelsByImpact(idUser) {
    let set = {
      $push: {
        favouriteChannels: {
          $each: [],
          $sort: { impact: -1 }
        }
      }
    }
    let query = { id: idUser}
    try {
      var ordinamentoPerImpatto = new Promise((resolve, reject) => {
        User.updateOne(query, set, (err, res) => {
          if (err) throw(err)
          resolve(res)
        })
      })
      return await ordinamentoPerImpatto
    } catch(error) {
      console.log(error)
    } 
  }

  async isEmptycollection() {
    try {
      var video = new Promise(async(resolve, reject) => {
        Video.find().exec(async(err, res) =>{
          if (err) throw (err)
          if (res) {
            resolve(res.length === 0)
          }
        })
      })
      
      var user = new Promise((resolve, reject) => {
        User.find().exec((err, res) =>{
          if (err) throw (err)
          if (res) {
            resolve(res.length === 0)
          }
        })
      })
      return {
        user: await user,
        video: await video
      }
    } catch(error) {
      console.log(error)
    }
  }
}

var helper = new Helper()
module.exports = Object.freeze(helper)