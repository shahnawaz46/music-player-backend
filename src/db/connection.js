const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD

const connection = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${user}:${password}@music-app.f5jla.mongodb.net/music-palayer-detail?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Database connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection