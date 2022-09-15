const token = localStorage.getItem('token')
const amount = document.getElementById('amount')
const description = document.getElementById('Description')
const category = document.getElementById('category')
var itemList = document.querySelector("#items") 
// 
const btn = document.querySelector('button')
btn.addEventListener('click' ,addExpense)
itemList.addEventListener('click',removeElement)

window.addEventListener('DOMContentLoaded',()=>{
  axios.get('http://localhost:3000/home', { headers: {"Authorization" : token} })
  .then(user=>{

      console.log("user premium check :",user.data.user.isPremium)

      let premium = user.data.user.isPremium

      if(premium){
          let premiumDiv = document.querySelector(".premium-feature")

          premiumDiv.innerHTML = `
          <li><a href="../LeaderBoard/LeaderBoard.html" id="leaderboard" style="color: #00ffe3;">Leaderboard</a></li>
          `
      }
      
 
  
      // if condition is false then down condtion is run
 axios.get('http://localhost:3000/home/getExpense',{headers: {"authorization" : token}}).then((res)=>{
  console.log("get dom",res.data)
   let expenses = res.data.expenses
  
   for(var i=0; i<expenses.length; i++){
     let expID = expenses[i].id
     let expAmount = expenses[i].amount
     let expDescription = expenses[i].description
     let expCategory = expenses[i].category
     let expDate = expenses[i].createdAt.slice(0,10)

     getAllExpense(expAmount,expDescription,expCategory,expDate ,expID)
   }
 }).catch(err=>{
    console.log(err)
 })
})
})

function addExpense(e){
  e.preventDefault()
  const obj ={
    amount:amount.value,
    Description:description.value,
    Category:category.value
  }
   // console.log(obj)
  axios.post('http://localhost:3000/home/addExpense',obj, {headers: {"authorization" : token}}).then((res)=>{
   
    // console.log("res data",res.data)
    let expenseData = res.data.result
    let date = expenseData.createdAt.slice(0,10)
    console.log("expense add",expenseData)
     getAllExpense(expenseData.amount, expenseData.description, expenseData.category,date, expenseData.id)
  }).catch(res=>{
    console.log("frontend error",res.msg)
   
  })
}

function getAllExpense(expAmount,expDescription,expCategory,expDate ,expID){
  // to make empty inputs
   document.getElementById('amount').value=''
   document.getElementById('Description').value=''
   document.getElementById('category').value=''
  
   console.log("get func")
    let newExpense = `${expAmount}  :  ${expCategory}  :  ${expDescription}  :  ${expDate}`
    
    //creating element by DOM
    const li = document.createElement('li')

    li.className='list-group-items'
   
     li.style.textAlign ='center'
    li.style.border= '1px solid';
    // li.style.background ='#821010';
    li.style.margin= '5px 10px';
    li.style.color= 'black';
    li.style.wordSpacing = '10px';
    li.style.marginLeft= '25%';
    li.style.marginRight= '25%';
    li.style.background='oldlace'
    li.style.listStyle= 'none';
    li.id = expID
    
    li.appendChild(document.createTextNode(newExpense))
    // Creating del button element
    var delBtn = document.createElement("button")
    delBtn.className = "btn btn-danger btn-sm float-right delete"

    delBtn.appendChild(document.createTextNode("X"))

    li.appendChild(delBtn)
    
    itemList.append(li)
    
}

async function removeElement(e){
   var id = e.target.parentElement.id
      // console.log("list id :",id)
         await axios.post(`http://localhost:3000/home/deleteExpense/${id}`,{},{ headers: {"authorization" : token} })
            .then((res)=>{
                console.log(res)
                var li = e.target.parentElement
                itemList.removeChild(li)
            }).catch(err=>{
              console.log(err)
            })
}


//logout functionality
var logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener("click",(e)=>{
  
    localStorage.clear()
    window.location.replace('../login/login.html')
})

const premiumBtn = document.querySelector('#premium')

premiumBtn.addEventListener("click", purchasePremium)  

async function purchasePremium(e){
  e.preventDefault()
    const response = await axios.get('http://localhost:3000/home/premiumExpenses',{ headers: {"authorization" : token}})
    //  console.log(response.data.razorpay_payment_id)
         console.log("razorpay",response)
     //step-1
    var options =
        {
         "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
         "name": "Akash Info-Tech",
         "order_id": response.data.order.id, // For one time payment
         "prefill": {
           "name": "Akash",
           "email": "baba.user@example.com",
           "contact": "9039760370"
         },
         "theme": {
          "color": "#3399cc"
         },
         //step-3 "if step-2 not hit the success(payment) not didnt get a response data"
         "handler": function (response) {
          console.log("handler:",response)

          //step-4
          axios.post('http://localhost:3000/home/updatetransactionStatus',{order_id: options.order_id,
          payment_id: response.razorpay_payment_id}, { headers: {"authorization" : token}} ).then(()=>{
            alert("you are premium user")
          }).catch(()=>{
            alert("something went wrong !! please try again")
          })
         }
        }
        //step-2
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        //if payment failed
        rzp1.on('payment.failed', function (response){
          alert("payment failed");
      });
}

////////////////////////////////////////////////////////////////////////////////////////////////////

var paginated = document.querySelector('.container')
      paginated.innerHTML =`
      <label for="rows">Rows </label>
      <select  id="rows" style="width:88px;padding:0px" value="50">
            <option >choose</option>
            <option value=1>1</option>
            <option value=3>3</option>
            <option value=4>4</option>
            <option value=5>5</option>
     </select>
   
    `
    var optionRow = document.getElementById('rows')
    optionRow.addEventListener('change',async (e)=>{
       e.preventDefault()
       while (itemList.hasChildNodes()) {
        itemList.removeChild(itemList.firstChild);
      }
      // console.log( optionRow.value)
      var row =parseInt(optionRow.value) 
      // console.log(typeof(row))
    await axios.get(`http://localhost:3000/home/LimitExpense/${row}`,{ headers: {"authorization" : token}}).then(result=>{
        // console.log("limit data:", result.data)
        let limitData =result.data.expenses
        console.log(limitData)
        for(var i=0; i<limitData.length; i++){
          let expID = limitData[i].id
          let expAmount = limitData[i].amount
          let expDescription = limitData[i].description
          let expCategory = limitData[i].category
          let expDate = limitData[i].createdAt.slice(0,10)
     
          getAllExpense(expAmount,expDescription,expCategory,expDate ,expID)  
        }
        
      }).catch(err=>{
        console.log(err)
      })
    })
