import Transaction from "../models/transactionSchema.js"
import Users from "../models/userSchema.js"
import { generateRandom } from "../services/generateRandom.js";
import Accounts from "../models/accountSchema.js";


export const getTransaction = async (req,res) => {
    try {
        const findTransaction = await Transaction.find({})

        const findFromCustomer = findTransaction.map((transaction)=> transaction.fromCustomerName)
        const findToCustomer = findTransaction.map((transaction)=>transaction.toCustomerName)
        const fromCustomer = await Users.find({_id:findFromCustomer})
        const toCustomer = await Users.find({_id:findToCustomer})
        

        const fromCustomerObject = {}
        fromCustomer.forEach((customer)=>{
            return fromCustomerObject[customer._id] = customer.name;
        })

         const toCustomerObject = {}
        toCustomer.forEach((customer)=>{
            return toCustomerObject[customer._id] = customer.name;
        })

        const pastData = findTransaction.map((transaction)=>{
            const fromCustomerName = fromCustomerObject[transaction.fromCustomerName] || 'Unknown'
            const toCustomerName = toCustomerObject[transaction.toCustomerName] || 'Unknown'

            const list = {...transaction.toObject(),fromCustomerName:fromCustomerName,toCustomerName:toCustomerName}
            delete list.__v;
            return list;
        })

        return res.status(200).json({
            message:'Fetch Transaction Successfully.',
            length:pastData.length,
            data:pastData
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const postTransaction = async(req,res) => {
    const {fromCustomerName,toCustomerName,amount,transactionType} = req.body;
    if(!fromCustomerName || !toCustomerName || !amount || !transactionType){
        return res.status(404).json({
            message:"Please Filled Out in the form field."
        })
    }
    if(amount < 500){
        return res.status(400).json({
            message:"Amount is greater than 500"
        })
    }
    try {
        const findfromUser = await Accounts.findOne({accountNo:fromCustomerName})
        if(!findfromUser){
            return res.status(404).json({
                message:"Account does not exist."
            })
        }
        if(findfromUser){

            // const findAccount = await Accounts.findOne({customerName:findfromUser._id})

            if(findfromUser.balance >= amount){
                const findToUser = await Accounts.findOne({accountNo:toCustomerName})
                if(!findToUser){
                    return res.status(404).json({
                        message:"Account does not exist."
                    })
                }
                if(findToUser){
                    const transactionNo = generateRandom(10)
                    const newWithdraw = await Transaction.create({
                        transactionNo:transactionNo,
                        fromCustomerName:findfromUser.customerName,
                        toCustomerName:findToUser.customerName,
                        transactionType:transactionType,
                        amount:amount,
                        status:"Pending"
                    })

                    if(newWithdraw){
                        const withdraw = findfromUser.balance - amount;
                        const updateFromAccount = await Accounts.findOneAndUpdate({_id:findfromUser._id},{balance:withdraw})
                        if(updateFromAccount){
                            const plusAmount = findToUser.balance + amount;
                            const updateToAccount = await Accounts.findOneAndUpdate({_id:findToUser._id},{balance:plusAmount})
                            if(updateToAccount){
                                await Transaction.findOneAndUpdate({_id:newWithdraw._id},{status:"Completed"})
                                return res.status(201).json({
                                    message:"Payment Successfully."
                                })
                            }
                        }
                    }else{
                        return res.status(400).json({
                            message:"Payment Failed."
                        })
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

export const getUserTransaction =  async(req,res) => {
    const {userId} = req.params;
    if(!parseInt(userId)){
        return res.status(404).json({message:"Not Found"})
    }
    try {
        const findUser = await Transaction.find({fromCustomerName:userId})
        const findToUser = await Transaction.find({toCustomerName:userId})
        const userlist = [...findUser,...findToUser]
        const findFromCustomer = userlist.map((transaction)=> transaction.fromCustomerName)
        const findToCustomer = userlist.map((transaction)=>transaction.toCustomerName)
        const fromCustomer = await Users.find({_id:findFromCustomer})
        const toCustomer = await Users.find({_id:findToCustomer})
        

        const fromCustomerObject = {}
        fromCustomer.forEach((customer)=>{
            return fromCustomerObject[customer._id] = customer.name;
        })

         const toCustomerObject = {}
        toCustomer.forEach((customer)=>{
            return toCustomerObject[customer._id] = customer.name;
        })

        const pastData = userlist.map((transaction)=>{
            const fromCustomerName = fromCustomerObject[transaction.fromCustomerName] || 'Unknown'
            const toCustomerName = toCustomerObject[transaction.toCustomerName] || 'Unknown'

            const list = {...transaction.toObject(),fromCustomerName:fromCustomerName,toCustomerName:toCustomerName}
            delete list.__v;
            return list;
        })

        return res.status(200).json({
            message:'Fetch Transaction Successfully.',
            length:pastData.length,
            data:pastData
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}