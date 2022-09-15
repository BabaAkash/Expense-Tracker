const email = document.getElementById('InputEmail1')
const btn = document.querySelector('button')

btn.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log("email", email.value)

    axios.post('http://localhost:3000/password/forgotpassword',{email:email.value}).then(res=>{
        console.log("data forgot :", res)
    }).catch(err=>{
        console.log("email are Incorrect",err)
    })
})
