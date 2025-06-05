import jwt from 'jsonwebtoken'

export const generateToken = async(userId,res) => {
    const token = jwt.sign({userId},process.env.secrete_key,{
        expiresIn:'30d'
    })

    if(!token){
        return res.status(400).json({
            message:"Invalid Token"
        })
    }

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.node_env !== 'development',
        sameSite:"strict",
        maxAge:30 * 24 * 60 * 60 * 1000
    })

    return token;
}