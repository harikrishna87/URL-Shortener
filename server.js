const express = require("express");
const mongoose = require("mongoose")
const shortUrl = require('./models/shorturl.js')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const MongoUri = 'mongodb://127.0.0.1:27017/urlshortener'

mongoose.connect(MongoUri, {
    serverSelectionTimeoutMS : 60000,
    socketTimeoutMS : 90000
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.set("view engine", "ejs")

app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post("/shortUrls", async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const foundUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (foundUrl == null) return res.sendStatus(404)

        foundUrl.clicks++
        foundUrl.save()

    res.redirect(foundUrl.full)
})

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})