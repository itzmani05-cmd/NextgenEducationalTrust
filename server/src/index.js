import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import applicationsRouter from './routes/applications.js'
import authRouter from './routes/auth.js'
import donationsRouter from './routes/donations.js'

const app = express()
const port = process.env.PORT || 4000

// Wide open — no origin allowlist. Auth is Bearer-token based (never cookies),
// so an unrestricted origin doesn't expose credentialed requests. Revisit if
// CORS_ORIGIN-based restriction is wanted back later.
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/donations', donationsRouter)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File is too large. The maximum upload size is 1MB.' })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error.' })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
