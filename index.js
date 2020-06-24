
var express = require('express');
var app = express();

const interation = require('./videoInteration/videoInteration')
const suggestion = require('./suggestion/suggestion')
const helper = require('./helper')
const user = require('./user/user')
const database = require("./database")
const middleware = require ("./middleware")
const global = require('./const')


const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(middleware)

// ROUTES
app.post('/addLike', interation.addLike);
app.post('/addComment', interation.addComment);
app.post('/share', interation.share);
app.post('/isViral', helper.isViral);
app.post('/refreshHype', helper.refreshHype);
app.get('/getLastVideos', interation.getLastVideos);
app.get('/getLastUsers', user.getLastUsers);
app.post('/getUserDetailsById', user.getUserDetailsById);
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

