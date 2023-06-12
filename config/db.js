const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
require('dotenv').config();

let url = 'mongodb://localhost:27017/mfb'

// if(process.env.NODE_ENV === 'production') {
//     url = process.env.DB_STRING_PROD;
// } else {
//     url = process.env.DB_STRING;
// }

const connect = mongoose.connect(url);

module.exports = connect;