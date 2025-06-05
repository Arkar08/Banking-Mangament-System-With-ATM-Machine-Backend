import Transaction from "../models/transactionSchema.js"
import Users from "../models/userSchema.js"



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