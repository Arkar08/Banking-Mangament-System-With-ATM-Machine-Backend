import mongoose from "mongoose";


const atmSchema = new mongoose.Schema({
    atmName:{
        type:String,
        require:true,
        unique:true
    },
    branchName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Branch",
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    limit:{
        type:Number,
        require:true
    },
    atmLocation:{
        type:String,
        require:true
    }
},{timestamps:true})


const ATM = mongoose.model("ATM",atmSchema)

export default ATM;