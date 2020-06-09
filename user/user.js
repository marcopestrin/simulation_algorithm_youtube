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

  async videoWatched(idVideo, idUser, percentage) {
    let author = await helper.getIdAuthor(idVideo)
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
            console.log(res)
          }
        })
      }
    })
  }
}
module.exports = UserClass