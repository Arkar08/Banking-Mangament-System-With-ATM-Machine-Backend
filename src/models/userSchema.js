import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    profile:{
        type:String
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        maxLength:11
    },
    password:{
        type:String,
        require:true,
        minLength:6
    },
    role:{
        type:String,
        enum:["Customer","Agent","Admin"],
        default:"Customer"
    },
    branchName:{
        type:mongoose.Schema.Types.ObjectId,
        refs:"Branch",
    },
    address:{
        type:String
    }
},{timestamps:true})


const Users = mongoose.model("Users",userSchema)

export default Users;