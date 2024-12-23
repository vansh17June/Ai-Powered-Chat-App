import React from 'react'
import SignUp from './pages/SignUp'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

const App = () => {
  return (
    <div className='h-screen w-full bg-[#ffffff] '>
      <Router>
      <Routes>
        <Route path='/' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
      </Router>
      
    </div>
  )
}

export default App
