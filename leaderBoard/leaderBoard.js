

const token = localStorage.getItem('token')
const nav = document.getElementById('navBar')
const itemList = document.querySelector("#items") 

window.addEventListener("DOMContentLoaded",()=>{
    console.log("dome")
    axios.get('http://localhost:3000/home', { headers: {"Authorization" : token} })
    .then(user=>{

        console.log(user.data.user.isPremium)

        let premium = user.data.user.isPremium

        if(premium){
            let premiumDiv = document.querySelector(".premium-feature")

            premiumDiv.innerHTML = `
            <li class="nav-item" ><a class="nav-link text-success" href="../LeaderboardPage/leaderboard.html" id="leaderboard">Leaderboard</a></li>
           
            <li class="nav-item" ><button id="darkmode">Dark Mode</button></li>
            `
            let darkbtn = document.getElementById('darkmode')
              darkbtn.addEventListener('click',(e)=>{
                let body = e.target.parentElement.parentElement.parentElement.parentElement.parentElement
               body.style.background ='#004019'
              })
            }

    axios.get('http://localhost:3000/home/leaderBoard',{ headers: {"authorization" : token}}).then((result)=>{
            console.log("leader data",result.data)
            let totals = result.data.totalAmount // array (totals)
            displayLeaderboard('0','Username', 'Total Expense')
                    for(let i=0; i<totals.length; i++){
                        displayLeaderboard(totals[i].userId, totals[i].name, totals[i].total_amount)
                    }
                    }).catch((error)=>{
                    console.log(error)
                    })
  })
})
//    background: radial-gradient(black, transparent);


function displayLeaderboard(userId, userName, userTotalExp){
 
    let li = document.createElement("li")
    li.className = "list-group-item"
    li.id = userId

    li.innerHTML = `
        
    ${userName}  &emsp; &emsp; &emsp; &emsp;&emsp; &emsp; &emsp; &emsp; ${userTotalExp}
    
    `
    itemList.appendChild(li)
}


//logout functionality
var logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener("click",(e)=>{ 
    localStorage.clear()
    window.location.replace('../home/home.html')
})