const { User, Video } = require("./model");
const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")
const helper = require('./helper')

module.exports = async(req, res, next) => {
  try {

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
        User.insertMany(userToAdd, function(error, result){
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
  } catch(error) {
    console.log(error)
  }
  next()
}