import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    transactionNo:{
        type:String
    },
    fromCustomerName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Users",
    },
    toCustomerName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Users",
    },
    transactionType:{
        type:String,
        enum:["Withdraw","Deposit","Transfer"]
    },
    transactionTime:{
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        require:true
    },
    notes:{
        type:String
    },
    status:{
        type:String,
        enum:["Pending","Completed"]
    }
},{timestamps:true})

const Transaction = mongoose.model("Transaction",transactionSchema)

export default Transaction;