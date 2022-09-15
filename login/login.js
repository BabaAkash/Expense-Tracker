const btn = document.querySelector('button')
const email = document.getElementById('InputEmail1')
const password = document.getElementById('InputPassword1')

btn.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log("login")
    var obj={
        email:email.value,
        password:password.value
    }
    
    axios.post('http://localhost:3000/login',obj).then(res=>{
       
        console.log(res.status)
        if(res.status==202){
          localStorage.setItem('token',res.data.token)// local.setItem('key','value')
          localStorage.setItem('userDetail',JSON.stringify({name:res.data.name, email:res.data.email}))
          window.location.replace('../home/home.html')
        }
    }).catch(err=>{
        // console.log("error l",err.toString())
        let errMsg = err.toString()
        if(errMsg=='Error: Request failed with status code 404'){
            showAlert(true)
        } else if(errMsg='Error: Request failed with status code 401'){
            showAlert(false)
        }
    })
})

function showAlert(flag){
    if(flag){
        swal("User doesn't exist!", "Please Signup to create account", "warning");
        // swal("User doesn't exist!", "Login succesfully", "success");
    }else{
        swal("Failed", "Incorrent password", "warning");
    }
}