import Branch from "../models/branchSchema.js"
import Users from "../models/userSchema.js"


export const getUserController = async(req,res)=> {
    try {
        const findUser = await Users.find({})
        return res.status(200).json({
            message:"Fetch User successfully.",
            length:findUser.length,
            data:findUser
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const postUserController = async(req,res) => {
    const {name,email,password,phoneNumber,branchName,role,address} = req.body;
    if(!name || !email || !password || !branchName){
        return res.status(404).json({message:"Please Filled out in the form field."})
    } 

    try {
        const findEmail = await Users.findOne({email:email})
        if(findEmail){
            return res.status(400).json({message:"Email is already exist."})
        }
        const findName = await Users.findOne({name:name})
        if(findName){
            return res.status(400).json({message:"Name is already exist."})
        }
        if(password.length <= 6){
            return res.status(400).json({message:"Password should be greather than 6."})
        }

        if(phoneNumber.length > 11){
            return res.status(400).json({message:"Phone Number should be less than 12."})
        }

        const findBranch = await Branch.findById({_id:branchName})

        if(!findBranch){
            return res.status(400).json({message:"Branch Name does not exist."})
        }

        const newUsers = await Users.create({
            name:name,
            email:email,
            password:password,
            phoneNumber:phoneNumber,
            role:role,
            branchName:findBranch._id,
            address:address
        })

        return res.status(201).json({
            message:"Create User Successfully.",
            data:newUsers
        })
        

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getUserIdController = async(req,res) => {
    return res.status(200).json("get userId")
}

export const patchUserController = async(req,res) => {
    return res.status(200).json("patch user")
}

export const deleteUserController = async(req,res) => {
    return res.status(200).json("delete user")
}