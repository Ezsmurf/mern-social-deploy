// server/routes/user.routes.js
import express from 'express'
import userCtrl from '../controllers/user.controller.js'

const router = express.Router()

// List & create users
router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

// Default profile photo (SVG placeholder served by controller)
router.get('/api/users/defaultphoto', userCtrl.defaultPhoto)

// User CRUD by id
router.route('/api/users/:userId')
  .get(userCtrl.read)
  .put(userCtrl.update)     // TEMP: no auth middleware to get you running
  .delete(userCtrl.remove)  // TEMP: no auth middleware to get you running

// Bind :userId to loader
router.param('userId', userCtrl.userByID)

export default router
