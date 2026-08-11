const mongoose=require("mongoose")

/**this model is to log out so first of all delete the cookies so all data is remove so no unauthorized access is done */

const tokenBlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
        unique:[true,"token is required"]
    }
},{
        timestamps:true
})

tokenBlacklistSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3   //3days
})

const tokenBlackListModel=mongoose.model("tokenBlackList",tokenBlacklistSchema)

module.exports=tokenBlackListModel

