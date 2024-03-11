const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    shortUrl:String,
    shorten:String,
    realUrl:String
})

const Model = mongoose.model('Url', urlSchema);

module.exports = Model