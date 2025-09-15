// server/server.js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  extensions: ['.js', '.jsx'],
  ignore: [/node_modules/],
})

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './express.js'

dotenv.config()

mongoose.Promise = global.Promise
const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  `mongodb://mongo:27017/${process.env.MONGODB_DB || 'mernsocial'}`

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' Connected to MongoDB at', mongoUri))
  .catch((err) => console.error(' MongoDB connection error:', err))

const PORT = process.env.PORT || 4000
app.listen(PORT, (err) => {
  if (err) console.error(' Failed to start server:', err)
  console.info(` Server running at http://localhost:${PORT}/`)
})
