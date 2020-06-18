const global = require('./const.js')
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/'+global.DATABASE_NAME, {useNewUrlParser: true});
