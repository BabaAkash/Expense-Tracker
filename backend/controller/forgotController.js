const sgMail =require('@sendgrid/mail')
const user = require('../model/user')
const Forgetpassword   = require('../model/forgotpassword')
const {v4 : uuidv4} = require('uuid')
const bcrypt = require("bcrypt");

exports.forgotPassword= async (req, res)=>{
    const email = req.body.email
    await user.findOne({where:{email:email}})
    .then((user)=>{
      //user exist
      if(user){
        var id = uuidv4()
        user.createForgotpassword({id,active:true}).then((result)=>{
          console.log("inserting data:",result)
        }).catch((err)=>{
          console.log(err)
        })
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email, 
          from: "akashyadav5737@gmail.com", 
          subject: "Forgot password",
          text: "and easy to do anywhere, even with Node.js",
          html: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
        }

        sgMail
          .send(msg)
          .then((response) => {
            console.log("email sent", response)
            return res
              .status(response[0].statusCode)
              .json({
                message: "Link to reset your password have sent to your mail ",
                sucess: true,
              });
          })
          .catch((error) => {
           res.status(401).json(error)
          })
      }else{// user does not exits
        res.status(404).json({msg:"user not found"})
        console.log("user not found")
      }
      
     
    }).catch(error=>{
      res.status(401).json({msg:"something went wrong"})
      console.log("something went wrong",error)
    })
}

exports.resetPassword=(req, res)=>{
  // console.log(req.params.id)
  var id  = req.params.id
  Forgetpassword.findOne({where:{id:id}}).then((forgotpassword)=>{
    // get the data from forgotpassowrd table
    if(forgotpassword){
      if(!forgotpassword.active){
         res.status(202).send(`<html><h1>Link expire</h1><html>`)
      }
      forgotpassword.update({active:false}).then((update)=>{console.log("paswd update:",update)})
      res.status(202).send(`<html> <body>
      <form action="/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
      </form>
      </body></html>`)
      res.end();
    }else{
      console.log("data not receive")
    }
  })
}

exports.updatePassword=(req, res)=>{
  // console.log("form data url",req.query)
  // console.log("form data name=newpassword :",req.query.newpassword)
    var newPassword = req.query.newpassword
    var id = req.params.id
    Forgetpassword.findOne({where:{id}}).then((data)=>{
      console.log("data", data)
     
      user.findOne({where:{id:data.userId}}).then(user=>{
        if(user){
           bcrypt.hash(newPassword,10,function(err, hash){
            console.log("password hash:",hash)
             user.update({password:hash}).then(()=>{
              console.log("user update paswd:",user.password)
               res.status(200).send(`<html><h1>Your Password successfully Changed</h1></html>`)
             }).catch(err=>{console.log(err)})
           }) 
        }else{
          // console.log("user doesnt exist")
          res.status(404).json({msg:"user not found"})
        }
      })
    }).catch(err=>{
      console.log(err)
    })
}
