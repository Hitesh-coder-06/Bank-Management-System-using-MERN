const accountModel=require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const crypto = require("crypto");

async function createAccountController(req, res) {

    const user = req.user;

    // Check if account already exists
    const existingAccount = await accountModel.findOne({
        user: user._id
    });

    if (existingAccount) {
        return res.status(400).json({
            message: "You already have a bank account."
        });
    }

    // Create new account
    const account = await accountModel.create({
        user: user._id
    });

    res.status(201).json({
        account,
        message: "Account created successfully"
    });
}


/**Get All user Account */
async function getUSerAccountsController(req,res){
    const account=await accountModel.find({user:req.user._id})

    res.status(200).json({
        account
    })


}

/**Get user balance  */
async function getAccountBalanceController(req, res) {

    const account = await accountModel.findOne({
        user: req.user._id
    });

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance
    });
}

/**Deposite Money */
async function depositMoneyController(req, res) {

    try {

        const user = req.user;

        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Enter a valid amount"
            });
        }

        const account = await accountModel.findOne({
            user: user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        const transaction = await transactionModel.create({

            fromAccount: account._id,

            toAccount: account._id,

            amount,

            status: "COMPLETED",

            idempotencyKey: crypto.randomUUID()

        });

        await ledgerModel.create({

            account: account._id,

            transaction: transaction._id,

            type: "CREDIT",

            amount

        });

        res.status(200).json({

            message: "Money deposited successfully",

            transaction

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

async function getMyAccount(req, res) {

    try {

        const account = await accountModel.findOne({
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        return res.status(200).json({
            account
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

}
async function getMyAccountController(req, res) {

    try {

        const account = await accountModel.findOne({
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Please create an account first."
            });
        }

        return res.status(200).json(account);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

}
module.exports={
    createAccountController,
    getUSerAccountsController,
    getAccountBalanceController,
    depositMoneyController,
    getMyAccount,
    getMyAccountController
}