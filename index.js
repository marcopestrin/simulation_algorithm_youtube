const VideoInterationClass = require('./videoInteration/videoInteration')
var interation = new VideoInterationClass()
const { User, Video } = require("./model");
/*
const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")
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
const idUser = 3
const percentage = 65
const idVideo = 4
// interation.addLike(idVideo, idUser)
// interation.addComment(idVideo, idUser)
// interation.share(idVideo, idUser)
interation.feedbackTimeWatched(idVideo, idUser, percentage)