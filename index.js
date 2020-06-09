const VideoInterationClass = require('./videoInteration/videoInteration')
var interation = new VideoInterationClass()
const { User, Video } = require("./model");
const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")

/*
if (userToAdd) {
  User.insertMany(userToAdd, function(error, result){
    error ? console.log(error) : console.log(result)
  })
}
if (videoToAdd) {
  Video.insertMany(videoToAdd, function(error, result){
    error ? console.log(error) : console.log(result)
  })
}
*/


const idUser = 4
const percentage = 80
const idVideo = 1
// interation.addLike(2, idUser)
// interation.addComment(2, idUser)
// interation.share(2, idUser)
interation.feedbackTimeWatched(idVideo, idUser, percentage)