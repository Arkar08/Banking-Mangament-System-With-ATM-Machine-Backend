import jwt from 'jsonwebtoken'
import Users from '../models/userSchema.js';

export const authMiddleware = async(req,res,next) => {
    const token = req.headers.authorization;
    if(token){
        try {
            const sliceToken = token.split(" ")
            const decoded = jwt.decode(sliceToken[1],process.env.secrete_key)
            req.user = await Users.findById(decoded.userId)
            if (!req.user) {
                return res.status(404).json({message:"User not found"});
            }
            next();
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
    } else {
      return res.status(400).json({message:"No token."});
    }
}

  export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
      next();
    } else {
      return res.status(401).json({message:"Not authorized as an Admin"});
    }
  };

  export const authorizeCustomer = (req,res,next) => {
    if(req.user && req.user.role === 'Customer'){
        next()
    }else{
        return res.status(401).json({message:"Not authorized as a Customer"})
    }
  }