const mongoose = require("mongoose");
const ledgerModel=require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index:true   //speed fast when searching
    },

    status: {
        type: String,
        enum:{ 
            values:["active", "inactive", "blocked"],
            message:"Status can be either ACTIVE,FROZEN, or CLOSED"
        },
        default:"active"
       
    },
    currency:{
        type:String,
        required:[true,"currecy is required for creating an account"],
        default:"INR"

    },
   
}, {
    timestamps: true
},

);


accountSchema.index({user:1,status:1})


//track user balance or check sender balance

//If use is new then aggregation return empty array

accountSchema.methods.getBalance= async function(){

    //agregation pipeline  == in mongodb we can create our method or create custom method
    const balanceData = await ledgerModel.aggregate([
    {
        $match: {
            account: this._id
        }
    },
    {
        $group: {
            _id: null,
            totalDebit: {
                $sum: {
                    $cond: [
                        { $eq: ["$type", "DEBIT"] },
                        "$amount",
                        0
                    ]
                }
            },
            totalCredit: {
                $sum: {
                    $cond: [
                        { $eq: ["$type", "CREDIT"] },
                        "$amount",
                        0
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            balance: {
                $subtract: ["$totalCredit", "$totalDebit"]
            }
        }
    }
]);

 if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
}



const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;