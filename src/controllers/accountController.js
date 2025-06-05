import Accounts from "../models/accountSchema.js"
import Transaction from "../models/transactionSchema.js";
import Users from "../models/userSchema.js";
import { generateRandom } from "../services/generateRandom.js";


export const getAccountController = async(req,res) => {
    try {
        const findAccount = await Accounts.find({})
        const findUser = findAccount.map((account)=> account.customerName)
        const userlist = await Users.find({_id:findUser})

        const userListObject = {};
        userlist.forEach((user)=>{
            return userListObject[user._id] = user.name;
        })


        const pastAccount = findAccount.map((account)=>{
            const customerName = userListObject[account.customerName] || "Unknown";
            const list = {...account.toObject(),customerName:customerName}
            delete list.__v;
            return list;
        })

        return res.status(200).json({
            message:"Fetch User Successfully.",
            length:pastAccount.length,
            data:pastAccount
        })

    } catch (error) {
         return res.status(500).json({message:error.message})
    }
}

export const postAccountController = async(req,res) => {
    const {customerName,accountType,balance} = req.body;
    if(!customerName || !accountType){
        return res.status(404).json({
            message:"Please Filled out in the form field."
        })
    }

    try {
        const account = generateRandom(10);

        const findAccount = await Accounts.findOne({customerName:customerName})
        if(findAccount){
            return res.status(400).json({
                message:"Customer is already created Account."
            })
        }
        if(!findAccount){
            const findUser = await Users.findById({_id:customerName})
            if(findUser){
                const newAccount = await Accounts.create({
                    accountNo:account,
                    customerName:findUser._id,
                    accountType:accountType,
                    balance:balance
                })
                return res.status(201).json({
                    message:"Account Create Successfully.",
                    data:newAccount
                })

            }else{
                return res.status(404).json({
                    message:"Customer does not exist."
                })
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getAccountIdController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({
            message:"Not Found"
        })
    }
    try {
        const findAccount = await Accounts.findById({_id:id})
        if(!findAccount){
            return res.status(404).json({
                message:"Account Id does not exist."
            })
        }
        if(findAccount){
             const pastData = {...findAccount.toObject()}
            delete pastData.__v;
            return res.status(200).json({
                message:"Fetch Account Id Successfully.",
                data:pastData
            })
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const patchAccountController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({
            message:"Not Found"
        })
    }
    try {
        const findAccount = await Accounts.findById({_id:id})
        if(!findAccount){
            return res.status(404).json({
                message:"Account Id does not exist."
            })
        }
        if(findAccount){
            const updateAccount = await Accounts.findOneAndUpdate({_id:id},{...req.body})
            if(updateAccount){
                const findAccountId = await Accounts.findById({_id:updateAccount._id})
                if(findAccountId){
                    const pastData = {...findAccountId.toObject()}
                    delete pastData.__v;
                    return res.status(200).json({
                        message:"Update Account Successfully.",
                        data:pastData
                    })
                }
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const deleteAccountController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({
            message:"Not Found"
        })
    }
    try {
        const findAccount = await Accounts.findById({_id:id})
        if(!findAccount){
            return res.status(404).json({
                message:"Account Id does not exist."
            })
        }
        if(findAccount){
            const deleteAccount = await Accounts.findOneAndDelete({_id:id})
            if(deleteAccount){
                return res.status(200).json({
                    message:"Delete Account Successfully."
                })
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const withdraw = async(req,res) => {
    const {fromCustomerName,toCustomerName,amount} = req.body;
    if(!fromCustomerName || !toCustomerName || !amount){
        return res.status(404).json({
            message:"Please Filled Out in the form field."
        })
    }
    try {
        const findfromUser = await Users.findById({_id:fromCustomerName})
        if(!findfromUser){
            return res.status(404).json({
                message:"User does not exist."
            })
        }
        if(findfromUser){

            const findAccount = await Accounts.findOne({customerName:findfromUser._id})

            if(findAccount.balance >= amount){
                const findToUser = await Users.findById({_id:toCustomerName})
                if(!findToUser){
                    return res.status(404).json({
                        message:"Account does not exist."
                    })
                }
                if(findToUser){
                    const transactionNo = generateRandom(10)
                    const newWithdraw = await Transaction.create({
                        transactionNo:transactionNo,
                        fromCustomerName:findfromUser._id,
                        toCustomerName:findToUser._id,
                        transactionType:"Withdraw",
                        amount:amount,
                        status:"Pending"
                    })

                    if(newWithdraw){
                        const withdraw = findAccount.balance - amount;
                        const updateFromAccount = await Accounts.findOneAndUpdate({_id:findAccount},{balance:withdraw})
                        if(updateFromAccount){
                            const findToAccount = await Accounts.findOne({customerName:findToUser._id})
                            const plusAmount = findToAccount.balance + amount;
                            const updateToAccount = await Accounts.findOneAndUpdate({_id:findToAccount},{balance:plusAmount})
                            if(updateToAccount){
                                await Transaction.findOneAndUpdate({_id:newWithdraw._id},{status:"Completed"})
                                return res.status(201).json({
                                    message:"Payment Successfully."
                                })
                            }
                        }
                    }

                }
            }else{
                return res.status(404).json({
                    message:`${findfromUser.name}'s amount is low.`
                })
            }        
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const deposit = async(req,res) => {
    return res.status(200).json("Deposit")
}

export const transfer = async(req,res) => {
    return res.status(200).json("transfer")
}