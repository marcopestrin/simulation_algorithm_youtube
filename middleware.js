const { User, Video, Author,Category } = require("./model");
const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")
const authorToAdd = require("./author.json")
const categoryToAdd = require("./category.json")
const helper = require('./helper')
const jwt = require('jsonwebtoken')
const global = require('./const')

module.exports = async(req, res, next) => {
  try {
    if(req.path != '/registration' && req.path != '/login') {
      jwt.verify(req.headers.token, global.SECRET_KEY_TOKEN)
    }

    res.header("Access-Control-Allow-Origin", "*"); //no cors
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    res.header("Access-Control-Allow-Credentials", false);
    
    let isEmptycollection = await helper.isEmptycollection()

    if(isEmptycollection.user && userToAdd) {
      var userAdded = new Promise((resolve, reject) => {
        User.insertMany(userToAdd.user, function(error, result){
          if (error) throw(error)
          resolve(result)
        })
      })
    }
    await userAdded
    
    if(isEmptycollection.video && videoToAdd.video){
      var videoAdded = new Promise((resolve, reject) => {
        Video.insertMany(videoToAdd.video, function(error, result){
          if (error) throw(error)
          resolve(result)
        })
      })
      await videoAdded
    }
    /*
    Author.insertMany(authorToAdd.author, function(error, result){
      if (error) throw(error)
    })

    Category.insertMany(categoryToAdd.category, function(error, result){
      if (error) throw(error)
    })
    */
    next()
  } catch(error) {
    res.json(error)
  }
}