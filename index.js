require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/connectDB')
const route = require('./routes')
const corsOptionsDelegate = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())
app.use(credentials)
app.use(cors(corsOptionsDelegate))

route(app)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
})
