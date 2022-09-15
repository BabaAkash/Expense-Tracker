const btn = document.querySelector('button')

const name = document.getElementById('InputName')
const email = document.getElementById('InputEmail1')
const mobile = document.getElementById('InputMobile')
const password = document.getElementById('InputPassword1')

btn.addEventListener('click',(e)=>{
    e.preventDefault()
   var obj ={
    name:name.value,
    email:email.value,
    password:password.value,
    mobile:mobile.value
   }
   axios.post('http://localhost:3000/signup',obj).then((res)=>{
    console.log("flag data:",res.data.flag)
    showAlert(res.data.flag)
   })
})
function showAlert(flag){
    if(flag){
        swal("Good job!", "User created", "success");
    }else{
        swal("Failed", "User already created", "warning");
    }
}