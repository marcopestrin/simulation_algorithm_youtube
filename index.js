const VideoInterationClass = require('./videoInteration/videoInteration')
const SuggestionClass = require('./suggestion/suggestion')
var suggestion = new SuggestionClass()
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
async function exec(){
  const idUser = 3
  const percentage = 77
  const idVideo = 6
  // interation.addLike(idVideo, idUser)
  // interation.addComment(idVideo, idUser)
  // interation.share(idVideo, idUser)
  
  // interation.feedbackTimeWatched(idVideo, idUser, percentage)
  // var sugg = await suggestion.getFavouriteChannels(idUser)
  // var sugg2 = await suggestion.getSuggestedVideos(idUser)
}
exec()
/*

Tipi di interazione:
-condivisione del Video
-mi piace al Video
-commento al Video
-tempo di visualizzazione del video

ogni interazione ha un peso differente che va a determinare
quanto importante è quel canale e quella tipologia di video
(in base alla categoria) su quel determinato utente iscritto

viene fatta una preferenza sulle categorie e i canali in base
alle interazione degli utenti

ogni video tiene conto pure di quante interazioni ha avuto
in modo da creare un determiato hype in base alla viralità
che sta subendo

*/