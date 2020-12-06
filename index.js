const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const shortURLschema = require('./models/shorturl')

mongoose.connect(process.env.mongodb, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(console.log(`Connected to MongoDB Database`))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.get('/', async (req, res) => {
    const shortURLs = await shortURLschema.find()
    res.render('index', { shortURLs: shortURLs })
})

app.post('/shortURLs', async (req, res) => {
    await shortURLschema.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortURL', async (req, res) => {
    const shortUrl = await shortURLschema.findOne({ short: req.params.shortURL })
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.port, () => {
    console.log(`Started! \nListening On Port ${process.env.port}`)
})