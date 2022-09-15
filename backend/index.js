require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const sequelize = require('./util/database')
const userRoute = require('./routes/user')
const userHome = require('./routes/home')
const forgot = require('./routes/forgot')

//models
const User = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const ForgetPassword  = require('./model/forgotpassword')

const app = express()

app.use(cors())

//middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());

//routes
app.use(userRoute)
app.use(userHome)
app.use(forgot)

// relation
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User)

sequelize.sync().then(res=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
