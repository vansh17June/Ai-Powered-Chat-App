import React from 'react'
import logo from "../assets/logo.svg"
import axios from "axios"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate=useNavigate()
    const [Email, setEmail] = React.useState("")
    const [Password, setPassword] = React.useState("")
    const handleChange=(e)=>{
        const {name, value} = e.target
        if(name === "Email"){
            setEmail(value)
        }
        if(name === "Password"){
            setPassword(value)
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log(Email, Password)
        if(Email === "" || Password === ""){
            return alert("Please fill all the fields")
        }else if(!Email.includes("@") ||Password.length < 8){
            return alert("Enter valid email and password")
        }
        try{
         const res=await axios.post(`http://localhost:5000/api/v1/user/login`, {email:Email, password:Password},{
          withCredentials:true
         })
        
            alert("Account login successfully")
           const id=res.data.person._id
           localStorage.setItem("id", id)
          navigate("/home")
         

        }catch(err){
            const message=err.res?.data.message||"Something went wrong"
            alert(message)
        }
    }
  return (
    <div className='h-screen w-full flex flex-col'>
        <span className='flex justify-center mt-10'><img src={logo} className='h-[30px] w-[30px]'></img></span>
        <form className='flex flex-col items-center justify-center gap-4 mt-10' onSubmit={(e)=>handleSubmit(e)}>
            <h1 className='text-3xl font-bold text-black'>Create an account</h1>
            <label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
  <input type="text" className="grow" placeholder="Email" value={Email} name="Email" onChange={(e)=>handleChange(e)}/>
</label>
<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
  </svg>
  <input type="password" className="grow" placeholder='Password' name="Password" onChange={(e)=>handleChange(e)} value={Password}/>
  
</label>
<button className="btn btn-success h-[60px] w-[255px] text-2xl text-white" type='submit'>Continue</button>
<p className='text-sm text-black text-center'>Do not have an Account? <Link to="/" className='text-blue-500'>Login</Link></p>
        </form>
      
    </div>
  )
}

export default Login
