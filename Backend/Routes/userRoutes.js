const express=require('express')
const router=express.Router()
const {createUser,loginUser,logout,UpdatePreviousSearch,UpdateSearch,giveResponse,getResponse,getSearchHistory}=require('../Controller/userController')
const AuthenticateUser=require('../Authenticate')
router.post('/create',createUser)
router.post('/login',loginUser)
router.get('/logout',logout)
router.post('/updatePreviousSearch',AuthenticateUser,UpdatePreviousSearch)
router.post('/updateSearch',AuthenticateUser,UpdateSearch)
router.post('/giveResponse',AuthenticateUser,giveResponse)
router.post('/getResponse',AuthenticateUser,getResponse)
router.get('/getSearchHistory',AuthenticateUser,getSearchHistory)
module.exports=router   