const express= require('express')
const router = express.Router()
const authenticate = require('../autorrization/autorrization')
const homeController = require('../controller/home')
const orderController = require('../controller/order')


router.get('/home',authenticate.authenticateToken,homeController.getUserDetails)
router.post('/home/addExpense',authenticate.authenticateToken ,homeController.postExpense)
router.get('/home/getExpense',authenticate.authenticateToken,homeController.getAllExpense)
router.post('/home/deleteExpense/:id',authenticate.authenticateToken,homeController.deleteExpense)
router.get('/home/premiumExpenses',authenticate.authenticateToken, orderController.premiumExpense)
router.post('/home/updatetransactionStatus',authenticate.authenticateToken,orderController.UpdateTransaction )
router.get('/home/leaderBoard',authenticate.authenticateToken,homeController.getExpenseTotals)

router.get('/home/report/getDailyExpenses',authenticate.authenticateToken,homeController.getDailyExpenses)
router.get('/home/report/getWeeklyExpenses',authenticate.authenticateToken, homeController.getWeekExpnses)
router.get('/home/LimitExpense/:row',authenticate.authenticateToken,homeController.limitExpense )
module.exports = router