const transactionModel=require("../models/transaction.model");
const ledgerModel=require("../models/ledger.model");
const emailService=require("../services/email.service");

const accountModel=require("../models/account.model");
const mongoose=require("mongoose")
/***
 * the 10 step transfer flow
 *1. validate request
 * 2.validate idempotence key
 * 3.check account status
 * 4.derive sender balance from ledger
 * 5.create transaaction (PENDING)
 * 6.create debit ledger entry
 * 7.create ledger entry
 * 8.mark transaction completed
 * 9.commit mongodb session
 * 10.send email notification
 */
async function createTransaction(req, res) {

    /**1.Validate request */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    // Check if all required fields are present
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            success: false,
            message: "fromAccount, toAccount, amount and idempotencyKey are required"
        });
    }

    const fromUSerAccount=await accountModel.findOne({
        _id:fromAccount,
    })

    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUSerAccount || !toUserAccount){
        return res.status(404).json({
            message:"inValid from or toAccount"
        })
    }
  

    //2.validate idempotency key

    const isTransacationAlreadyExists=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    if(isTransacationAlreadyExists){
        if(isTransacationAlreadyExists.status==="COMPLETED"){
          return  res.status(200).json({
                message:"transaction already processed"
            })
        }
        if(isTransacationAlreadyExists.status==="PENDING"){
          return  res.status(200).json({
                message:"transaction is still processing"
            })
        }
        if(isTransacationAlreadyExists.status==="FAILED"){
         return   res.status(500).json({
                messgae:"transaction processing is failed"
            })
        }
        if(isTransacationAlreadyExists.status==="REVERSED"){
          return  res.status(500).json({
                message:"transaction is reversed or retry"
            })
        }
    }

    /**3.Check Account Status */

    if(fromUSerAccount.status!=="active" || toUserAccount.status!=="active"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**4.Derive/Track Sender balance or check send er balance*/

    const balance=await fromUSerAccount.getBalance()

    if(balance<amount){
       return res.status(400).json({
            message:`Insufficent balance.Current balance is ${balance}.Requested amount is ${amount} `
        })
    }
  let transaction;
   try {
    
  
    // * 5.create transaaction (PENDING)

    const session=await mongoose.startSession()
    session.startTransaction()

    transaction=await transactionModel.create([{   //if one transaction is suuccess or if not any success then not all successed
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session})


  
    const debitLedgerEntry=await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction[0]._id,
        type:"DEBIT"
    }],{
        session
    })

    await (()=>{
        return new Promise((resolve)=>{setTimeout(resolve,10*1000)

        })
    })

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction[0]._id,
        type:"CREDIT"
    }],{
        session
    })

  transaction[0].status="COMPLETED"
  await transaction[0].save({session})

  await session.commitTransaction()
  session.endSession()
   } catch (error) {
    
    return res.status(500).json({
        message:"Transaction  failed due to internal error/internal issue",
        error:error.message
    })
   }


  /**10 Send Email */
 
  try {
    
  await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)
  return res.status(201).json({
    message:"transaction completed successfully",
    transaction:transaction
  })
    
  } catch (error) {
    console.log("email send failed")
  }

  return res.status(201).json({
    message: "transaction completed successfully",
    transaction: transaction
});

 
}

async function createInitialFundsTransaction(req,res){
       const {toAccount,amount,idempotencyKey}=req.body

       if(!toAccount || !amount ||! idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amount and idempotency key are required"
        })
       }

       const toUserAccount=await accountModel.findOne({
        _id:toAccount,
       })
       if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid TO account"
        })
       }

       const fromUSerAccount=await accountModel.findOne({
        systemUser:true,
        user:req.user._id
       })

       if(!fromUSerAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
       }

       //transaction initiate
       const session=await mongoose.startSession()
       session.startTransaction()

       const transaction=await transactionModel.create([{     //when we use session all data are given in array of object
        fromAccount:fromUSerAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"

       }])

       const debitLedgerEntry=await ledgerModel.create({
        account:fromUSerAccount._id,
        amount:amount,
        transaction:transaction[0]._id,
        type:"DEBIT"
       },{session})
       
        const creditLedgerEntry=await ledgerModel.create({
        account:toAccount,
        amount:amount,
        transaction:transaction[0]._id,
        type:"CREDIT"
       },{session})

       transaction[0].status="COMPLETED"
       await transaction[0].save({session})

       await session.commitTransaction()
       session.endSession()

       return res.status(201).json({
        message:"Transaction is succesffully completed"
       })
       

}

// async function getMyTransactions(req, res) {

//     try {

//         const account = await accountModel.findOne({
//             user: req.user._id
//         });

//         if (!account) {
//             return res.status(404).json({
//                 message: "Account not found"
//             });
//         }

//         const transactions = await transactionModel.find({
//             $or: [
//                 { fromAccount: account._id },
//                 { toAccount: account._id }
//             ]
//         })
//         .sort({ createdAt: -1 });

//         return res.status(200).json(transactions);

//     } catch (error) {

//         return res.status(500).json({
//             message: error.message
//         });

//     }

// }
async function getMyTransactions(req, res) {

    try {

        const account = await accountModel.findOne({
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: account._id },
                { toAccount: account._id }
            ]
        })
        .sort({ createdAt: -1 });

        // const updatedTransactions = transactions.map((transaction) => {


        //     let type = "Credit";

        //     if (transaction.fromAccount.toString() === account._id.toString()) {
        //         type = "Debit";
        //     }

        //     return {
        //         ...transaction.toObject(),
        //         type
        //     };
        // });

        const updatedTransactions = transactions.map((transaction) => {

    let type;

    // Deposit
    if (
        transaction.fromAccount.toString() === account._id.toString() &&
        transaction.toAccount.toString() === account._id.toString()
    ) {
        type = "Credit";
    }

    // Money Sent
    else if (transaction.fromAccount.toString() === account._id.toString()) {
        type = "Debit";
    }

    // Money Received
    else {
        type = "Credit";
    }

    return {
        ...transaction.toObject(),
        type
    };
          });

        return res.status(200).json(updatedTransactions);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

}

module.exports={
    createTransaction,
    createInitialFundsTransaction,
    getMyTransactions
}