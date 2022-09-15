const user = require('../model/user')
const JWT = require('jsonwebtoken')
const bycrpt = require('bcrypt')
const {json} = require('body-parser')
let dummyToken = 'd4b0f29b1877137109172a1ed62067fa9351a507f7e8e6ffbdde9252df37870137891da68fc8a215f95a91cda7bcd0d342b190487d51457073bb514ede01861b'

exports.postSign =async (req, res)=>{
    console.log("hello")
    let userDetail = req.body
   let existingUser = await user.findAll({where:{email:userDetail.email}})
   if(existingUser.length == 0){
    const hashPassword = await bycrpt.hashSync(userDetail.password,10)
    let Newuser =await user.create({
       name:userDetail.name,
       email:userDetail.email,
       phoneNumber:userDetail.mobile,
       password:hashPassword
      })
      console.log("database save",Newuser)
       res.json({flag:true})
   }else{
       res.json({flag: false})
   } 
 }
 exports.postlogin =async (req,res)=>{
    let email = req.body.email
    let password = req.body.password// user k through password
    let userData =await user.findAll({where:{email:email}})
       // we got the user from database and we will get the user detail fom array if user exist in array of object
       if(userData.length>0){// user found
          const userId = userData[0].id
          const userName = userData[0].name
          const userEmail = userData[0].email
          const userPassHash = userData[0].password // database meib bycrpt wala pswd hasing wala

          const match = await bycrpt.compare(password,userPassHash)// boolean return
          if(match){
            let token = JWT.sign(userId,dummyToken)
             
             res.status(202).json({msg:"Login successfull" , token:token, name: userName ,email:userEmail })
          }else{// client side  error
            res.status(401).json({msg:"Login not authorised"})
          }
       }else{// user not found
          res.status(404).json({msg:"user not found"})
       }
 }