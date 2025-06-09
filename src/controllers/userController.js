import Branch from "../models/branchSchema.js"
import Users from "../models/userSchema.js"
import { generateToken } from "../utils/generateToken.js"
import bcrypt from "bcryptjs"

export const getUserController = async(req,res)=> {
    try {
        const findUser = await Users.find({})
        const findBranch = findUser.map((user)=> user.branchName)
        const branch = await Branch.find({_id:findBranch})

        const branchObject = {}

        branch.forEach((branches)=>{
            return branchObject[branches._id] = branches.branchName;
        })


        const data = findUser.map((user)=>{
            const branch = branchObject[user.branchName] || 'Unknown'
            const list = {...user.toObject(),branch:branch}
            delete list.__v;
            delete list.branchName
            delete list.password
            return list;
        })

        return res.status(200).json({
            message:"Fetch User successfully.",
            length:findUser.length,
            data:data
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const postUserController = async(req,res) => {
    const {name,email,password,phoneNumber,branchName,role,address,profile} = req.body;
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

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)

        const newUsers = await Users.create({
            profile:profile,
            name:name,
            email:email,
            password:hash,
            phoneNumber:phoneNumber,
            role:role,
            branchName:findBranch._id,
            address:address
        })

        const token = await generateToken(newUsers._id,res)

        return res.status(201).json({
            message:"Create User Successfully.",
            token:token,
            email:newUsers.email,
            _id:newUsers._id
        })
        

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getUserIdController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }
    try {
        const findUser = await Users.findById({_id:id})
        if(!findUser){
            return res.status(404).json({
                message:"User Id does not exist."
            })
        }
        if(findUser){
            const findBranch = await Branch.findById({_id:findUser.branchName})
            
            if(findBranch){
                 const findUserId = {...findUser.toObject()}
                delete findUserId.__v;
                delete findUserId.password

                return res.status(200).json({
                    message:"Fetch UserId Successfully.",
                    data:findUserId
                })
            }
        }
    } catch (error) {
         return res.status(500).json({message:error.message})
    }
}

export const patchUserController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }
    try {
        const findUser = await Users.findById({_id:id})
        if(!findUser){
            return res.status(404).json({
                message:"User Id does not exist."
            })
        }
        if(findUser){
            const updateUser = await Users.findOneAndUpdate({_id:id},{...req.body});
            if(updateUser){
                const findBranch = await Branch.findById({_id:updateUser.branchName})
                const findUserId = await Users.findById({_id:updateUser._id})
                 const patchUser = {...findUserId.toObject(),branch:findBranch.branchName,}
                delete patchUser.branchName;
                delete patchUser.__v;
                delete patchUser.password

                return res.status(200).json({
                    message:"Update User Successfully.",
                    data:patchUser
                })
            }
        }
    } catch (error) {
         return res.status(500).json({message:error.message})
    }
}

export const deleteUserController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }
    try {
        const findUser = await Users.findById({_id:id})
        if(!findUser){
            return res.status(404).json({
                message:"User Id does not exist."
            })
        }
        if(findUser){
            const deleteUser = await Users.findOneAndDelete({_id:id})
            if(deleteUser){
                return res.status(200).json({
                    message:"Delete User Successfully."
                })
            }
        }
    } catch (error) {
         return res.status(500).json({message:error.message})
    }
}