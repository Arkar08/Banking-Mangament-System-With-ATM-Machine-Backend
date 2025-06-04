import mongoose from "mongoose";



const branchSchema = new mongoose.Schema({
    branchName:{
        type:String,
        require:true,
        unique:true
    },
    branchLocation:{
        type:String,
        require:true
    }
},{timestamps:true})


const Branch = mongoose.model("Branch",branchSchema)

export default Branch;