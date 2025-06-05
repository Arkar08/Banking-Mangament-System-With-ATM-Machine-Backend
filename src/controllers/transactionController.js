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
                        transactionType:transactionType,
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
