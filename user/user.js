const mongoose = require("mongoose");

const global = require('../const.js')
const { User } = require("../model");

mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});

const Helper = require("../helper")
var helper = new Helper()

class UserClass {
  constructor(idVideo,idUser){
  }

  videoCommented(idVideo, idUser) {
    let query = { id: idUser }
    // traccio che l'utente ha commentato questo video
    let set = {$push: {commentedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  }
  
  videoLiked(idVideo, idUser) {
    let query = { id: idUser }
    // traccio che a l'utente è piaciuto questo video
    let set = {$push: {likedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  }
  
  videoShared(idVideo, idUser) {
    let query = { id: idUser }
    // traccio che l'utente ha condiviso questo video
    let set = {$push: {sharedVideos: idVideo}};
    User.updateOne(query, set, (err, res) => {
      err ? console.log(err) : console.log(res)
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

  async categoryAlreadyWatched(category, idUser){
    // controllo se questo utente ha già guardato un video di questa categoria
    let query = { id: idUser }
    let fieldsToReturn = {
      favouritesCategory: true
    }
    let categoryExist
    var findCategory = new Promise((resolve, reject) => {
      User.findOne(query, fieldsToReturn, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          categoryExist = this.categoryExist(res.favouritesCategory, category)
        }
        resolve(true)
      })
    })
    await findCategory
    return categoryExist
  }
  
  getDurationVideo(){
    return 43432
  }

  async addImpactCategory(category, idUser){
    let set, newData, filter
    let query = { id: idUser }
    let impact = this.getDurationVideo() * global.WEIGHT_TIME_WATCH_IN_BEST_CAT
    if(await this.categoryAlreadyWatched(category, idUser)) {
      // vado ad incrementare l'interesse verso questa categoria
      set = { $inc: {
        "favouritesCategory.$[el].impact": impact
      }}
      filter = { arrayFilters: [
        { "el.category": parseInt(category) }
      ]}
    } else {
      // l'utente è neofita di quetsa categoria di video
      newData = { category, impact }
      set = { $push: {
        favouritesCategory: newData
      }}
    }
    User.updateOne(query, set, filter, (err, res) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
      }
    })
  }

  async videoWatched(idVideo, idUser, percentage) {
    let author = await helper.getIdAuthor(idVideo)
    let category = await helper.getIdCategory(idVideo)
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
            // console.log(res)
            this.addImpactCategory(category, idUser)
          }
        })
      }
    })
  }
}
module.exports = UserClass