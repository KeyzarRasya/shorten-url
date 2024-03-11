require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const Url = require('./model/Url')
const path = require('path')

mongoose.connect(process.env.MONGO_URI)
.then(res => console.log('Connected'))
.catch(err => console.log(err))

const app = express();
const PORT = process.env.PORT || 3001

const isAvail = async(req, res, next) => {
    const {real} = req.body;
    const findUrl = await Url.findOne({url:real})
    if(!findUrl ){
        return next()
    }
    return res.redirect('/')
}

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('views'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))

app.get('/', (req, res) => {
    res.render('home', {base:process.env.BASE_ADDRESS})
})


app.post('/create', isAvail, async(req, res) => {
    const {real, shorten} = req.body;
    const shortUrl = `${process.env.BASE_ADDRESS}${shorten}`
    const newUrl = new Url({realUrl:real, shortUrl, shorten})
    await newUrl.save();
    res.render('result', {newUrl})
})

app.get('/:shorten', async(req, res) => {
    const {shorten} = req.params;
    console.log(shorten)
    const findUrl = await Url.findOne({shorten})
    if(!findUrl){
        return res.redirect('/');
    }
    res.redirect(`${findUrl.realUrl}`);
})

app.listen(PORT, () => {
    console.log('Running')
})