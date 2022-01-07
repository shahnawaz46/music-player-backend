const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const connection = require('./src/db/connection')
const { signup, login } = require('./src/controller/UserRoutingMethod')


const app = express()
dotenv.config()

// database connection
connection()

app.use(cors())
app.use(express.json())
app.use(express.static('music'))


app.post('/api/songs', async (req, res) => {
    const { slug } = req.body
    await fs.readFile(path.join(__dirname, '/song_api/songApi.json'), 'utf-8', (error, data) => {
        if (error) {
            return res.status(400).json({ error })
        } else if (data) {
            const songData = JSON.parse(data)
            const songs = songData.songType.filter((value) => value.type === slug)
            return res.status(200).json({ ...songs })
        }
    })
})



app.post('/api/user/signup', signup)
app.post('/api/user/login', login)


const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})