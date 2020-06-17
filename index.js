
var express = require('express');
var app = express();

const VideoInterationClass = require('./videoInteration/videoInteration')
const SuggestionClass = require('./suggestion/suggestion')
const UserClass = require('./user/user')
var suggestion = new SuggestionClass()
var interation = new VideoInterationClass()
var user = new UserClass()

const { User, Video } = require("./model");
const global = require('./const')

const userToAdd = require("./user.json")
const videoToAdd = require("./video.json")

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(async(req, res, next) => {
  // MIDDLEWARE
  try {
    if(await user.isEmptycollection() && userToAdd) {
      var userAdded = new Promise((resolve, reject) => {
        User.insertMany(userToAdd, function(error, result){
          if (error) throw(error)
          resolve(result)
        })
      })
    }
    await userAdded
    if(await interation.isEmptycollection() && videoToAdd.video){
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
})

// ROUTES
app.post('/addLike', interation.addLike);
app.post('/addComment', interation.addComment);
app.post('/share', interation.share);
app.post('/isViral', interation.isViral);
app.post('/refreshHype', interation.refreshHype);
app.post('/feedbackTimeWatched', interation.feedbackTimeWatched);
app.post('/getSuggestedVideos', async(req, res) => {
  res.send(await suggestion.getSuggestedVideos(req.body.idUser))
});

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

