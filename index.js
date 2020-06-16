
var express = require('express');
var app = express();

const VideoInterationClass = require('./videoInteration/videoInteration')
const SuggestionClass = require('./suggestion/suggestion')
const UserClass = require('./user/user')
const global = require('./const')

var suggestion = new SuggestionClass()
var interation = new VideoInterationClass()
var user = new UserClass()
const { User, Video } = require("./model");

const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")
const idUser = 3
const percentage = 90
const idVideo = 2


async function addLike(req, res) {
  res.send(await interation.addLike(idVideo, idUser))
}
async function addComment(req, res) {
  res.send(await interation.addComment(idVideo, idUser))
}
async function share(req, res) {
  res.send(await interation.share(idVideo, idUser))
}
async function isViral(req, res) {
  res.send(await interation.isViral(idVideo, idUser))
}
async function refreshHype(req, res) {
  res.send(await interation.refreshHype(idVideo, idUser))
}
async function feedbackTimeWatched(req, res) {
  res.send(await interation.feedbackTimeWatched(idVideo, idUser, percentage))
}
async function getFavouriteChannels(req, res) {
  res.send(await suggestion.getFavouriteChannels(idUser))
}
async function getSuggestedVideos(req, res) {
  res.send(await suggestion.getSuggestedVideos(idUser))
}

app.post('/addLike', addLike);
app.post('/addComment', addComment);
app.post('/share', share);
app.post('/isViral', isViral);
app.post('/refreshHype', refreshHype);
app.post('/feedbackTimeWatched', feedbackTimeWatched);
app.post('/getFavouriteChannels', getFavouriteChannels);
app.post('/getSuggestedVideos', getSuggestedVideos);

app.post('/', async(req, res) => {
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
})

app.listen(global.EXPRESS_PORT, function () {
  console.log('App listening on port '+ global.EXPRESS_PORT);
});
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

