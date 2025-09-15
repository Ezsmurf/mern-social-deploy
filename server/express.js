// server/express.js
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

// Routes & HTML template
import userRoutes from './routes/user.routes.js'
import Template from '../template.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(cors())

// Allow the client bundle to load (tighten later if you want strict CSP)
app.use(helmet({ contentSecurityPolicy: false }))

// Serve the built client (webpack output)
app.use('/dist', express.static(path.join(__dirname, '../dist')))

// API routes
app.use('/', userRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'api' })
})

// Send HTML shell; React mounts/hydrates on the client
app.get('*', (_req, res) => {
  res.status(200).send(Template({ markup: '', css: '' }))
})

export default app
