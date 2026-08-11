const express=require("express")

const authMiddleware=require("../middleware/auth.middleware")

const accountController=require("../controllers/account.controller")

const router=express.Router()



//post method    api/accounts/
//create a new account   protected route  ==valid token is neccesary

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

/**
 * GET/api/accounts/balance/:accountId
 * 
 */

router.get("/balance",
    authMiddleware.authMiddleware,
    accountController.getAccountBalanceController)

/**Depossite Money */   
router.post(
    "/deposit",
    authMiddleware.authMiddleware,
    accountController.depositMoneyController
);

router.get(
    "/my",
    authMiddleware.authMiddleware,
    accountController.getMyAccountController
);

module.exports=router