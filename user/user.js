const mongoose = require("mongoose");

const global = require('../const.js')
const { User } = require("../model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

const Helper = require("../helper")
var helper = new Helper()

class UserClass {
  constructor(){}

  videoCommented(idVideo, idUser) {
    let action = global.ID_ACTION_COMMENT
    let query = { id: idUser }
    // traccio che l'utente ha commentato questo video
    let set = {$push: {commentedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : this.addImpact(idUser, idVideo, action)
    })
  }
  
  videoLiked(idVideo, idUser) {
    let action = global.ID_ACTION_LIKE
    let query = { id: idUser }
    // traccio che a l'utente è piaciuto questo video
    let set = {$push: {likedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : this.addImpact(idUser, idVideo, action)
    })
  }
  
  videoShared(idVideo, idUser) {
    let action = global.ID_ACTION_SHARE
    let query = { id: idUser }
    // traccio che l'utente ha condiviso questo video
    let set = {$push: {sharedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : this.addImpact(idUser, idVideo, action)
    })
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

  categoryExist(listCategories, category) {
    // la funziona controlla se il dato è presente nell'array
    for(var i = 0; i < listCategories.length; i++) {
      if (listCategories[i].category === category) {
        return true
      }
    }
    return false
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

  async categoryAlreadyWatched(category, idUser) {
    // controllo se questo utente ha già guardato un video di questa categoria
    let query = { id: idUser }
    let fieldsToReturn = {
      favouriteCategories: true
    }
    let categoryExist
    var findCategory = new Promise((resolve, reject) => {
      User.findOne(query, fieldsToReturn, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          categoryExist = this.categoryExist(res.favouriteCategories, category)
        }
        resolve(true)
      })
    })
    await findCategory
    return categoryExist
  }

  async channelAlreadyWatched(author, idUser) {
    // controllo se questo utente ha già guardato un video di questo canale
    let query = { id: idUser }
    let fieldsToReturn = {
      favouriteChannels: true
    }
    let channelExist
    var findChannel = new Promise((resolve, reject) => {
      User.findOne(query, fieldsToReturn, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          channelExist = this.channelExist(res.favouriteChannels, author)
        }
        resolve(true)
      })
    })
    await findChannel
    return channelExist
  }

  getImpactValue(action, duration) {
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
 
  addImpact(idUser, idVideo, action) {
    this.addImpactCategory(idUser, idVideo, action)
    this.addImpactChannel(idUser, idVideo, action)
  }

  async addImpactChannel(idUser, idVideo, action) {
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
    User.updateOne(query, set, filter, (err, res) => {
      if(err) {
        console.log(err)
      } else {
        // ordino le categorie per il loro valore d'impatto sull'utente
        this.sortChannelsByImpact(idUser)
      }
    })
  }

  async addImpactCategory(idUser, idVideo, action) {
    let set, newData, filter
    let category = await helper.getIdCategory(idVideo)
    let duration = await helper.getDurationVideo(idVideo)
    let impact = this.getImpactValue(action, duration)
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
    User.updateOne(query, set, filter, (err, res) => {
      if(err) {
        console.log(err)
      } else {
        // ordino le categorie per il loro valore d'impatto sull'utente
        this.sortCategoriesByImpact(idUser)
      }
    })
  }

  async videoWatched(idVideo, idUser, percentage) {
    let author = await helper.getIdAuthor(idVideo)
    let action = global.ID_ACTION_TIME_WATCH
    let query = { id: idUser }
    let set, filter
    User.findOne(query, (err, res) => {
      if(res) {
        if (this.authorAlreadyWatched(res.authorsWatched, author)) {
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
        User.updateOne(query, set, filter, (err, res) => {
          if(err) {
            console.log(err)
          } else {
            this.addImpact(idUser, idVideo, action)
          }
        })
      }
    })
  }
  
  sortCategoriesByImpact(idUser) {
    let set = {
      $push: {
        favouriteCategories: {
          $each: [],
          $sort: { impact: -1 }
        }
      }
    }
    let query = { id: idUser}
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  }
  
  sortChannelsByImpact(idUser) {
    let set = {
      $push: {
        favouriteChannels: {
          $each: [],
          $sort: { impact: -1 }
        }
      }
    }
    let query = { id: idUser}
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  }
}
module.exports = UserClass