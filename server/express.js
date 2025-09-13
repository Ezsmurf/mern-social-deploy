import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/mern-social'
// mongoose.set('strictQuery', true) # removed for Mongoose 7+
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  dbName: process.env.MONGODB_DB || 'mern-social'
}).then(() => {
  console.log('[mongo] connected to', mongoose.connection.host)
}).catch(err => {
  console.error('[mongo] initial connect error:', err?.message || err)
})

app.get('/api/health', (_req, res) => {
  const rs = mongoose?.connection?.readyState ?? 0
  const mongo = rs === 1 ? 'up' : 'down'
  res.status(200).json({
    ok: true,
    service: 'api',
    mongo,
    details: { readyState: rs }
  })
})

export default app
