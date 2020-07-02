const global = require('../const.js')
const helper = require("../helper")
const { User } = require("../model");

class SuggestionClass {

  async getFavouriteChannels(idUser){
    // ritorno i canali con più interazioni
    let fieldsToReturn = {
      favouriteChannels: { $slice: global.LIMIT_CHANNELS_SUGGESTION },
      _id: false
    }
    let query = {
      id: idUser
    }
    try {
      var channels = new Promise((resolve, reject) => {
        User.findOne(query, fieldsToReturn).exec((err, res) => {
          if(err) throw(err)      
          resolve(res.favouriteChannels)
        })
      })
      return await channels
    } catch (error) {
      console.log(error)
    }
  }

  async getFavouriteCategories(idUser){
    // ritorno le categorie con più interazioni
    let limit = {
      favouriteCategories: { $slice: global.LIMIT_CATEGORIES_SUGGESTION },
    }
    let query = {
      id: idUser
    }

    try {
      var categories = new Promise((resolve, reject) => {
        User.findOne(query, limit).lean(true).exec((err, res) => {
          if(err) throw(err) 
          resolve(res.favouriteCategories)
        })
      })
      return await categories
    } catch (error) {
      console.log(error)
    }
  }

  async getSuggestedVideos(idUser){
    // viene fatto un merge dei video preferiti in base alle categorie e ai canali
    let favouritesCategories = await this.getFavouriteCategories(idUser)
    let favouritesChannels = await this.getFavouriteChannels(idUser)
    let videos = []

    var resultsByCategories = new Promise(async(resolve, reject) => {
      for (var i = 0; i <= favouritesCategories.length; i++) {
        var videoDaInserire
        if (favouritesCategories[i]) {
          videoDaInserire = await helper.getVideosByCategory(favouritesCategories[i].category)
        }
        videos.push(videoDaInserire)
        if(i === favouritesCategories.length -1){
          resolve(true)
        }
      }
    })
    await resultsByCategories 

    var resultsByChannels = new Promise(async(resolve, reject) => {
      for (var x = 0; x <= favouritesChannels.length; x++) {
        var videoDaInserire
        if(favouritesChannels[x]) {
          videoDaInserire = await helper.getVideosByChannel(favouritesChannels[x].author)
        }
        videos.push(videoDaInserire)
        if(x === favouritesChannels.length -1){
          resolve(true)
        }
      }
    })
    await resultsByChannels
    
    //console.log(videos)
    // TO DO
    // rimuovere doppioni

    return videos
    
  }
}

var suggestion = new SuggestionClass()
module.exports = Object.freeze(suggestion)