// server/controllers/user.controller.js
import User from '../models/user.model'
import extend from 'lodash/extend.js'

/**
 * Load user by ID and attach to req.profile
 */
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
    if (!user) return res.status(400).json({ error: 'User not found' })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve user' })
  }
}

/**
 * Create user
 */
const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({ message: 'Successfully signed up!' })
  } catch (err) {
    return res.status(400).json({ error: 'Could not create user' })
  }
}

/**
 * List users (safe fields)
 */
const list = async (_req, res) => {
  try {
    const users = await User.find().select('name email updated created')
    res.json(users)
  } catch {
    return res.status(400).json({ error: 'Could not list users' })
  }
}

/**
 * Read single user (sanitized)
 */
const read = (req, res) => {
  const user = req.profile.toObject()
  delete user.hashed_password
  delete user.salt
  res.json(user)
}

/**
 * Update user
 */
const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    const sanitized = user.toObject()
    delete sanitized.hashed_password
    delete sanitized.salt
    res.json(sanitized)
  } catch {
    return res.status(400).json({ error: 'Could not update user' })
  }
}

/**
 * Remove user
 */
const remove = async (req, res) => {
  try {
    const user = req.profile
    const deletedUser = await user.deleteOne()
    const sanitized = deletedUser.toObject()
    delete sanitized.hashed_password
    delete sanitized.salt
    res.json(sanitized)
  } catch {
    return res.status(400).json({ error: 'Could not delete user' })
  }
}

/**
 * Default profile photo (no client import!)
 * Serve a tiny inline SVG placeholder.
 */
const defaultPhoto = (_req, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
    <rect width="100%" height="100%" fill="#e0e0e0"/>
    <circle cx="64" cy="48" r="24" fill="#bdbdbd"/>
    <rect x="28" y="82" width="72" height="34" rx="16" fill="#bdbdbd"/>
  </svg>`
  res.set('Content-Type', 'image/svg+xml')
  res.status(200).send(svg)
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  defaultPhoto
}
