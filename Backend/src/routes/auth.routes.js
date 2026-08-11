//for register route

const express=require("express")

//controller
const authController=require("../controllers/auth.controllers")

const router=express.Router()

// post/api/auth/register


//this is for user register
router.post("/register",authController.userRegisterController)

//this is for user login system

//post/api/auth/login


router.post("/login",authController.userLoginController)





module.exports=router