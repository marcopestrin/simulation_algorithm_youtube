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
    var ricercaAutore = new Promise((resolve, reject) => {
      Video.findOne(query, fieldsToReturn, (err, res) => {
        if (res){
          resolve(res.author)
        } else {
          reject(true)
        }
      })
    })
    await ricercaAutore
    return ricercaAutore
  }
}
