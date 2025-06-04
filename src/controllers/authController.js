
export const loginController = async(req,res)=> {
    return res.status(200).json('login user')
}

export const signupController = async(req,res) => {
    return res.status(200).json("Signup user")
}

export const logoutController = async(req,res) => {
    return res.status(200).json("logout user")
}