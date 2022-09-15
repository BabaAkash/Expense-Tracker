const User = require('../model/user')
const jwt =  require('jsonwebtoken')
let dummyToken = 'd4b0f29b1877137109172a1ed62067fa9351a507f7e8e6ffbdde9252df37870137891da68fc8a215f95a91cda7bcd0d342b190487d51457073bb514ede01861b'
exports.authenticateToken = (req, res, next)=>{
 
    let token = req.header('authorization')

        // console.log("header token",token)

        const userID = jwt.verify(token, dummyToken)// return user id value 
       
        // console.log("userID is here:",userID)// userId=11
        User.findByPk(userID).then(user=>{// id through k user ka data nikal lenge
            req.user = user
            // console.log("authenticate",req.user)
            next() // move to home route

        }).catch(err=>{
            throw new err
        })
}