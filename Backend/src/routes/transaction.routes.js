const {Router}=require("express")

const authMiddleware=require("../middleware/auth.middleware")

const transactionRoutes=Router();
const transactionContoller=require("../controllers/transaction.contoller")

// POST/api/transaction/
//create a new transaction

// 

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionContoller.createTransaction)
transactionRoutes.get(
    "/my",
    authMiddleware.authMiddleware,
    transactionContoller.getMyTransactions
);
module.exports=transactionRoutes;