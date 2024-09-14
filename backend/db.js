const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/inotebook";

const connectToMongo = () => {
   mongoose.connect(uri).then(console.log("connect successfully"));
}

module.exports = connectToMongo;