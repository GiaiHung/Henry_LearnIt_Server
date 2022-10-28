const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jingqlj.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  } catch (error) {
    console.error(error.message)
    process.exit(1) 
  }
}

module.exports = connectDB
