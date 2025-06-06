import Users from "../models/userSchema.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const loginController = async(req,res)=> {
    const {email,password} = req.body;

    if(!email || !password) {
        return res.status(404).json({message:"Please Filled Out in the form field."})
    }

    try {
        const validatorEmail  = await Users.findOne({email:email})
        if(!validatorEmail ){
            return res.status(404).json({
                message:"Email is wrong"
            })
        }
        if(validatorEmail ){
            const validatorPassword = await bcrypt.compare(password,validatorEmail.password) 
            if(!validatorPassword){
                return res.status(404).json({
                    message:"Password is wrong"
                })
            }
            if(validatorPassword){
                const token = await generateToken(validatorEmail._id,res)
                return res.status(200).json({
                    message:"Login Successfully",
                    email:validatorEmail.email,
                    _id:validatorEmail._id,
                    token:token
                })
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const signupController = async(req,res) => {
    return res.status(200).json("Signup user")
}

export const logoutController = async(req,res) => {
    return res.status(200).json("logout user")
}