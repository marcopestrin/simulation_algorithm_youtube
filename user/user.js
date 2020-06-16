const mongoose = require("mongoose");

const global = require('../const.js')
const { User } = require("../model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

const Helper = require("../helper")
var helper = new Helper()

class UserClass {
  constructor(){}

  async isEmptycollection() {
    try {
      let result
      var check = new Promise((resolve, reject) => {
        User.find().exec((err, res) =>{
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

  async videoCommented(idVideo, idUser) {
    let action = global.ID_ACTION_COMMENT
    let query = { id: idUser }
    // traccio che l'utente ha commentato questo video
    let set = {$push: {commentedVideos: idVideo}};
    try {
      var videoCommentato = new Promise((resolve, reject) => {
        User.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          let result = {
              videoCommentato: res,
              impatto: await this.addImpact(idUser, idVideo, action)
          }
          resolve(result)
        })
      })
      return await videoCommentato
    } catch(error) {
      console.log(error)
      return error
    }
  }
      
  async videoLiked(idVideo, idUser) {
    let action = global.ID_ACTION_LIKE
    let query = { id: idUser }
    // traccio che a l'utente è piaciuto questo video
    let set = {$push: {likedVideos: idVideo}};
    try {
      var videoPiaciuto = new Promise((resolve, reject) => {
        User.updateOne(query, set, async(err, res) => {
          if (err) throw(err)
          let result = {
            videoPiaciuto: res,
            impatto: await this.addImpact(idUser, idVideo, action)
          }
          resolve(result)
        })
      })
      return await videoPiaciuto
    } catch(error) {
      console.log(error)
      return error
    }
  }
  
  async videoShared(idVideo, idUser) {
    let action = global.ID_ACTION_SHARE
    let query = { id: idUser }
    // traccio che l'utente ha condiviso questo video
    let set = {$push: {sharedVideos: idVideo}};
    try {
      var videoCondiviso = new Promise((resolve, reject) => {
        User.updateOne(query, set, async(err, res) => {
          if(err) throw(err)
          let result = {
            videoCondiviso: res,
            impatto: await this.addImpact(idUser, idVideo, action)
          }
          resolve(result)
        })
      })
      return await videoCondiviso
    } catch(error) {
      console.log(error)
      return error
    }
  }

  authorAlreadyWatched(authorsWatched, author) {
    // controllo se l'utente ha visto in precedenza un video di questo autore
    if (authorsWatched.length) {
      for (var i = 0; i < authorsWatched.length; i++) {
        if (authorsWatched[i].author === author) {
          return true
        }
      }
    }
    return false
  }

  async categoryAlreadyWatched(category, idUser) {
    // controllo se questo utente ha già guardato un video di questa categoria
    let query = { id: idUser }
    let fieldsToReturn = {
      favouriteCategories: true
    }
    let categoryExist
    try {
      var findCategory = new Promise((resolve, reject) => {
        User.findOne(query, fieldsToReturn, (err, res) => {
          if(err) throw(err)
          categoryExist = helper.categoryExist(res.favouriteCategories, category)
          resolve(true)
        })
      })
      await findCategory
      return categoryExist
    } catch(error) {
      console.log(error)
    }
  }

  async channelAlreadyWatched(author, idUser) {
    // controllo se questo utente ha già guardato un video di questo canale
    let query = { id: idUser }
    let fieldsToReturn = {
      favouriteChannels: true
    }
    let channelExist
    try {
      var findChannel = new Promise((resolve, reject) => {
        User.findOne(query, fieldsToReturn, (err, res) => {
          if(err) throw(err)
          channelExist = helper.channelExist(res.favouriteChannels, author)
          resolve(true)
        })
      })
      await findChannel
      return channelExist
    } catch(error) {
      console.log(error)
    }
  }
 
  async addImpact(idUser, idVideo, action) {
    let impactedCategory = await this.addImpactCategory(idUser, idVideo, action)
    let impactedChannel = await this.addImpactChannel(idUser, idVideo)
    return Object.assign({}, impactedCategory, impactedChannel);
  }

  async addImpactChannel(idUser, idVideo) {
    try {
      let set, newData, filter
      let author = await helper.getIdAuthor(idVideo)
      let impact = global.IMPACT_VIEW_FOR_CHANNEL
      let query = { id: idUser }
      if(await this.channelAlreadyWatched(author, idUser)) {
        // vado ad incrementare l'interesse verso questa categoria
        set = { $inc: {
          "favouriteChannels.$[el].impact": impact
        }}
        filter = { arrayFilters: [
          { "el.channel": parseInt(author) }
        ]}
      } else {
        // l'utente è neofita di questa categoria di video
        newData = { channel: author , impact }
        set = { $push: {
          favouriteChannels: newData
        }}
      }
      var impattoCanale = new Promise((resolve, reject) => {
        User.updateOne(query, set, filter, async(err, res) => {
          if(err) throw (err)
          // ordino le categorie per il loro valore d'impatto sull'utente
          var result = {
            addImpactChannel: res,
            sortChannelsByImpact: await this.sortChannelsByImpact(idUser)
          }
          resolve(result)
        })
      })
      return await impattoCanale
    } catch(error) {
      console.log(error)
      return error
    }
  }

  async addImpactCategory(idUser, idVideo, action) {
    try {
      let set, newData, filter
      let category = await helper.getIdCategory(idVideo)
      let duration = await helper.getDurationVideo(idVideo)
      let impact = helper.getImpactValue(action, duration)
      let query = { id: idUser }
      if(await this.categoryAlreadyWatched(category, idUser)) {
        // vado ad incrementare l'interesse verso questa categoria
        set = { $inc: {
          "favouriteCategories.$[el].impact": impact
        }}
        filter = { arrayFilters: [
          { "el.category": parseInt(category) }
        ]}
      } else {
        // l'utente è neofita di questa categoria di video
        newData = { category, impact }
        set = { $push: {
          favouriteCategories: newData
        }}
      }
      var impattoCategoria = new Promise((resolve, reject) => {
        User.updateOne(query, set, filter, async(err, res) => {
          if(err) throw(err)
          // ordino le categorie per il loro valore d'impatto sull'utente
          var result = {
            addImpactCategory: res,
            sortCategoriesByImpact: await this.sortCategoriesByImpact(idUser)
          }
          resolve(result)
        })
      })
      return await impattoCategoria
    } catch(error) {
      console.log(error)
      return error
    }
  }

  async videoWatched(idVideo, idUser, percentage) {
    try {
      let author = await helper.getIdAuthor(idVideo)
      let action = global.ID_ACTION_TIME_WATCH
      let query = { id: idUser }
      let set, filter
      var videoGuardatoFeedback = new Promise((resolve, reject) => {
        User.findOne(query, (err, res) => {
          if (err) throw(err)
          if (res && this.authorAlreadyWatched(res.authorsWatched, author)) {
            // l'utente ha già visto un video di questo canale
            set = { $inc: {
              "authorsWatched.$[el].timeWatched": percentage
            }}
            filter = { arrayFilters: [
              { "el.author": parseInt(author) }
            ]}
          } else {
            // l'utente è la prima volta che scopre questo canale
            set = { $push: {
              authorsWatched: { author, timeWatched: percentage }
            }}
          }
          let query = { id: res.id }
          User.updateOne(query, set, filter, async(err, res) => {
            if (err) throw(err)
            let result = {
              videoGuardatoFeedback: res,
              impatto: await this.addImpact(idUser, idVideo, action)
            }
            resolve(result)
          })
        })
      })
      return await videoGuardatoFeedback
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
}
module.exports = UserClass