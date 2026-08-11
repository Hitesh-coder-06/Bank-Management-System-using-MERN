const express=require("express");

const app=express();    //server config

const cors=require("cors")
app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://bank-management-system-using-mern-1.onrender.com"
    ],
    credentials: true
}));


//cookie-parser

const cookieParser= require("cookie-parser")

//routes
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes")




//transaction routes
const transactionRoutes=require("./routes/transaction.routes")


//middleware
app.use(express.json())


app.use("/api/auth",authRouter)   //this api hit to authRouter for register

//cookkie
app.use(cookieParser())

app.use("/api/accounts",accountRouter)

app.use("/api/transaction",transactionRoutes)



module.exports=app;