const global = require('../const.js')
const helper = require("../helper")
const { User, Video } = require("../model");

class UserClass {
  constructor(){}

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
          categoryExist = this.categoryExist(res.favouriteCategories, category)
          resolve(true)
        })
      })
      await findCategory
      return categoryExist
    } catch(error) {
      console.log(error)
    }
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
          channelExist = this.channelExist(res.favouriteChannels, author)
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
      let author = await this.getIdAuthor(idVideo)
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
            sortChannelsByImpact: await helper.sortChannelsByImpact(idUser)
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
            sortCategoriesByImpact: await helper.sortCategoriesByImpact(idUser)
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
      let author = await this.getIdAuthor(idVideo)
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
}

var user = new UserClass()
module.exports = Object.freeze(user)