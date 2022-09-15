
const express = require('express')
const router = express.Router()
const forgotController =require('../controller/forgotController')

router.post('/password/forgotpassword', forgotController.forgotPassword)
router.get('/resetpassword/:id', forgotController.resetPassword)
router.get('/updatepassword/:id',forgotController.updatePassword)

module.exports= router