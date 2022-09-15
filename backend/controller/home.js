const User = require('../model/user')
const Expense =  require('../model/expense')
const {json} = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.postExpense =(req, res)=>{
    let expense = req.body
    // console.log("req.user: ",req.user)
    req.user.createExpense({
              amount: expense.amount,
            description: expense.Description,
            category: expense.Category
        })
        .then(result=>{
            res.status(200).json({result, msg: "Expense Added"})
        })
        .catch(err=>{
            console.log(err)
            res.status(402).json({msg: "Not added"})
        })
  
}
exports.getAllExpense = (req, res)=>{
    // req. user ---> middle ware "JWT authenticate"
    req.user.getExpenses().then(expenses=>{
        // console.log("primise method return",expenses)
        // res.json(expenses) // res.data.expense say data is not retrive
        res.json({expenses})
    }).catch(err=>{
        console.log(err)
    })
}
exports.limitExpense =(req,res)=>{
    console.log(req.params.row)
    
    let row =parseInt(req.params.row)
    console.log(typeof(row))
        req.user.getExpenses({offset:0,
        limit:row}).then(expenses=>{
      console.log("offset working", expenses)
        res.json({expenses})
    }).catch(err=>{
        console.log(err)
    })
}
// exports.getAllExpense = (req, res)=>{
   
//     req.user.getExpenses({offset:0,
//         limit:3}).then(expenses=>{
//       console.log("offset working", expenses)
//         res.json({expenses})
//     }).catch(err=>{
//         console.log(err)
//     })
// }
exports.deleteExpense= (req, res)=>{
    console.log("deleting id",req.params.id)
    let expId = req.params.id
    // database say row ko delete karna
    Expense.destroy({where:{id:expId}}).then(()=>{
        res.json("Removed")
    }).catch((err)=>{
        console.log(err)
    })
}

exports.getUserDetails = (req, res, next)=>{
    // console.log("data value: ",req.user)
    let user = req.user.dataValues
    res.json({user})
}

exports.getExpenseTotals = async (req, res, next)=>{ 
    
    const totalAmount = await Expense.findAll({
        attributes: [
          'userId',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
        ],
        group: ['userId'],
        raw: true
      })

      
    totalAmount.sort((a,b)=> b.total_amount-a.total_amount)
    
    for(let i=0; i<totalAmount.length; i++){
        let user = await User.findAll({

            attributes:['name'],
            where: {id: totalAmount[i].userId}
        })

        //console.log(user[0].name)

        totalAmount[i] = {...totalAmount[i], name: user[0].name}
    }

    //console.log(totalAmount)
    res.json({totalAmount})
      
}

exports.getDailyExpenses =(req, res)=>{
    const today = new Date()
    today.setHours(0,0,0,0)
    const now = new Date()
    
   console.log("data get:",req.user)
    req.user.getExpenses({
        where:{
            createdAt:{
                [Op.gt]: today,
                [Op.lt]: now
            }
        }
    })
    .then(result=>{
        console.log("result",result)
        res.json(result)
    })

}

exports.getWeekExpnses =(req, res)=>{
    // var today = new Date().setHours(0,0,0,0)
    // console.log("today",today)

    // var last = new Date().setDate(today-7)
    // console.log("lastDay",last)
    var today = new Date().getTime()
    console.log("today",today)

    var tday = new Date().getDate()

    var last = new Date().setDate(tday-7)
   
  
    req.user.getExpenses({
        where:{
            createdAt:{
                [Op.gt]: last,
                [Op.lt]: today
            }
        }
    })
    .then(result=>{
        console.log("result",result)
        res.json(result)
    }).catch(err=>{
        console.log(err)
    })
}
