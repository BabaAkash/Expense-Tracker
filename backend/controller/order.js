const Razorpay = require('razorpay')
const Order = require('../model/order')

exports.premiumExpense = (req, res)=>{
   console.log(req.body)
   try {
    const rzp = new Razorpay({
        key_id:'rzp_test_Howv7g12C2Za8S',
        key_secret:'gjPItOZlBlpgytyHooEyfiyL'
    });
    const amount =2500
    rzp.orders.create({amount, currency: "INR"},(err, order)=>{// order  data
        if(err) {
            throw new Error(err);
        }
        req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
            return res.status(201).json({ order, key_id : rzp.key_id});// we have to sent the order data to frontEnd

        }).catch(err => {
            throw new Error(err)
        }) 
    })
   } catch (err) {
    console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
   }
}

exports.UpdateTransaction =(req, res)=>{
    try {
         console.log("update transc",req.body)
        const { payment_id, order_id} = req.body;

        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({isPremium: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch((err)=>{
            throw new Error(err);
        })
    } catch (error) {
        console.log("errorrrrrr",error)
        res.status(403).json({ error: error, message: 'Sometghing went wrong' })
    }
}