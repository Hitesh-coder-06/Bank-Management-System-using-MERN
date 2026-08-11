const userModel=require("../models/user.model")
const emailService = require("../services/email.service");


//jwt token
const jwt=require("jsonwebtoken")


//api user register controller

//post/api/auth/register
async function userRegisterController(req,res){
       const{email,password,name}=req.body
       
       //check email double 
       const isExists=await userModel.findOne({
        email:email
       })
       
       if(isExists){     //user with same email
         return res.status(422).json({
            message:"user already exists with email",
            status:"failed"
         })
       }

       const user=await userModel.create({
        email,password,name
       })
       try {
    await emailService.sendRegistrationEmail(user.email, user.name);
      } catch (error) {
    console.log("Registration email failed:", error.message);
     }

       //token create 
       const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

       //save token in cookie-parser
       res.cookie("token",token)
       
       //res
       res.status(201).json({
        user:{
          _id:user._id,
          email:user.email,
          name:user.name
           
        },token
       } )

}

// Login Constroller this is use when user login with id and password 
//post/api/auth/login
async function userLoginController(req, res) {
    try {

        const { email, password } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Email is invalid"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Password is invalid"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token);

        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports={
  userRegisterController,
  userLoginController
}