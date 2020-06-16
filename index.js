const VideoInterationClass = require('./videoInteration/videoInteration')
const SuggestionClass = require('./suggestion/suggestion')
const UserClass = require('./user/user')

var suggestion = new SuggestionClass()
var interation = new VideoInterationClass()
var user = new UserClass()
const { User, Video } = require("./model");

const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")
const idUser = 3
const percentage = 90
const idVideo = 2

async function exec(){
  if(await user.isEmptycollection() && userToAdd) {
   User.insertMany(userToAdd, function(error, result){
      error ? console.log(error) : console.log(result)
    })
  }

  if(await interation.isEmptycollection() && videoToAdd.video){
    Video.insertMany(videoToAdd.video, function(error, result){
      error ? console.log(error) : console.log(result)
    })
  }
  
  // await interation.refreshHype()
  // await interation.isViral(idVideo)

  // await interation.addLike(idVideo, idUser)
  // await interation.addComment(idVideo, idUser)
  // await interation.share(idVideo, idUser)
  
  // await interation.feedbackTimeWatched(idVideo, idUser, percentage)
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


TO FIX:
-più azioni insieme se la categoria e/o canale sono nuovi, viene
letta come dato non presente.

TO DO:
- flag viralità
- da mettere a cron hype

*/