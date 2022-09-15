const token = localStorage.getItem('token')

const itemsDaily = document.getElementById('items-daily')
const itemsMonth = document.getElementById('items-month')
const itemsWeek = document.getElementById('items-week')


window.addEventListener('DOMContentLoaded',async()=>{
 let user =await axios.get('http://localhost:3000/home', { headers: {"Authorization" : token} })
 console.log("checking data",user.data.user.isPremium)

 let isPremium = user.data.user.isPremium
 if(isPremium){
   let premiumDiv = document.querySelector('.premium-feature')
   premiumDiv.innerHTML = `
   <li class="nav-item" ><a class="nav-link text-dark h3" href="../LeaderboardPage/leaderboard.html" id="leaderboard">Leaderboard</a></li>
   <li class="nav-item" ><a class="nav-link text-dark h3" href="../report/report.html" id="report">Report</a></li>
   <li class="nav-item" ><button id="darkmode">Dark Mode</button></li>
   `
   let darkbtn = document.getElementById('darkmode')
   darkbtn.addEventListener('click',(e)=>{
     let body = e.target.parentElement.parentElement.parentElement.parentElement.parentElement
    body.style.background ='#004019'
   })
   
 }
   let dailyExpenses = await axios.get('http://localhost:3000/home/report/getDailyExpenses', { headers: {"Authorization" : token} })
//    console.log("daily",dailyExpenses.data)
   let dailyArr = dailyExpenses.data
   for(var i=0; i<dailyArr.length; i++){
    //   console.log(dailyArr[i])
      displayDailyExpense(dailyArr[i].amount,dailyArr[i].description,dailyArr[i].category, dailyArr[i].createdAt.slice(0,10) ,itemsDaily)
   }

   let weekExpense = await axios.get('http://localhost:3000/home/report/getWeeklyExpenses', { headers: {"Authorization" : token} })
   console.log("week",weekExpense.data)
   let weekArr =weekExpense.data
   for(var i=0; i<weekArr.length; i++){
    //   console.log(weekArr[i])
      displayDailyExpense(weekArr[i].amount,weekArr[i].description,weekArr[i].category, weekArr[i].createdAt.slice(0,10) ,itemsWeek)
   }

   let monthExpense = await axios.get('http://localhost:3000/home/report/getMonthlyExpenses', { headers: {"Authorization" : token} })
   console.log("Monthly daata",monthExpense.data)
   let MonthArr =monthExpense.data
   for(var i=0; i<MonthArr.length; i++){
      displayDailyExpense(MonthArr[i].amount,MonthArr[i].description,MonthArr[i].category, MonthArr[i].createdAt.slice(0,10) ,itemsMonth)
   }
   
})

function displayDailyExpense(expAmount, expCategory, expDescription, expDate,itemList){
   var li = document.createElement('li')
   li.className='list-group-item'
   li.innerHTML = `
    ${expAmount}  &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expCategory} &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expDescription} &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp;
    ${expDate} 
    `
    itemList.appendChild(li)
}

//logout functionality
var logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener("click",(e)=>{ 
    localStorage.clear()
    window.location.replace('../login/login.html')
})