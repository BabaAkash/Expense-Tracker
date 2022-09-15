const express = require('express')
const router = express.Router()

const userController = require('../controller/user')

router.post('/signup',userController.postSign)
router.post('/login',userController.postlogin)
module.exports = router
