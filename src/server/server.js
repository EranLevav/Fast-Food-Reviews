const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
  // call dotenv and it will return an Object with a parsed key
  const env = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };
};


const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/ff_reviews',
  port: 8000
};

//setup database
mongoose.Promise = global.Promise;
// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.mongoURL, { useUnifiedTopology:true ,useNewUrlParser: true }, (error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!');
      throw error;
    }else console.log('connected to database!');
  });
}



const app = express();
//body parser for json. must be done before API routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); //handle body requests
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));



// Add backend api routes
fs.readdirSync(__dirname + '/api').forEach((file) => {
  require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
});


app.listen(config.port || 8000,
    () => console.log(`Listening on port ${process.env.PORT || 8000}!`));
