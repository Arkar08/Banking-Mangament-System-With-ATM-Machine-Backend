import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    accountNo:{
        type:String
    },
    customerName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Users",
        require:true
    },
    accountType:{
        type:String,
        require:true
    },
    balance:{
        type:Number,
        default:0
    },
    qrCode:{
        type:String
    },
    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }
},{timestamps:true})


const Accounts = mongoose.model("Accounts",accountSchema)

export default Accounts;