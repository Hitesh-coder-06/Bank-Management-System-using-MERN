require("dotenv").config();
const mongoose=require("mongoose");

function connectToDb(){
       mongoose.connect(process.env.MONGO_URI)
       .then(()=>{
        console.log("server is connect to db")
       })
       .catch(err=>{
        console.log("error connceting to db")
        process.exit(1)   //server is close
       })
}
connectToDb();  //calling connect to db funciton


module.exports=connectToDb;