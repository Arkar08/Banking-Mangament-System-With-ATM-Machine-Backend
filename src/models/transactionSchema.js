import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    transactionNo:{
        type:String
    },
    fromCustomerName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Users"
    },
    toCustomerName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Users"
    },
    atm:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"ATM"
    },
    transactionType:{
        type:String,
        require:true
    },
    transactionTime:{
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        enum:["Pending","Completed"]
    }
},{timestamps:true})

const Transaction = mongoose.model("Transaction",transactionSchema)

export default Transaction;