
var express = require('express');
var app = express();

const interation = require('./videoInteration/videoInteration')
const authentication = require('./authentication/authentication')
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
app.post('/registration', authentication.registration);
app.post('/login', authentication.login);

app.listen(global.EXPRESS_PORT, function () {
  console.log('App listening on port '+ global.EXPRESS_PORT);
});
