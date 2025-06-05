import Branch from "../models/branchSchema.js"
import Users from "../models/userSchema.js"

export const getBranchController = async(req,res) => {
    try {
        const findBranch = await Branch.find({})

        const pastData = findBranch.map((branch)=>{
            const list = {...branch.toObject()}
            delete list.__v;
            return list;
        })

        return res.status(200).json({
            message:"Fetch Branch Successfully.",
            length:pastData.length,
            data:pastData
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const postBranchController = async(req,res) => {
        const {branchName,branchLocation} = req.body;
        if(!branchName || !branchLocation){
            return res.status(404).json({
                message:"Please Filled out in the form field."
            })
        }
        try {
            const findBranchName = await Branch.findOne({branchName:branchName})
            if(findBranchName){
                return res.status(400).json({message:"Branch Name is already exist."})
            }

            const newBranch = await Branch.create({
                branchName:branchName,
                branchLocation:branchLocation
            })

            return res.status(201).json({
                message:"Create Branch Successfully.",
                data:newBranch
            })
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
}

export const getBranchIdController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }

    try {
        const findBranch = await Branch.findById({_id:id})
        if(!findBranch){
            return res.status(404).json({
                message:"Branch Id does not exist."
            })
        }
        if(findBranch){
             const pastData = {...findBranch.toObject()}
            delete pastData.__v;
            return res.status(200).json({
                message:"Fetch Branch Id Successfully.",
                data:pastData
            })
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const patchBranchController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }

    try {
        const findBranch = await Branch.findById({_id:id})
        if(!findBranch){
            return res.status(404).json({
                message:"Branch Id does not exist."
            })
        }
        if(findBranch){
            const patchBranch = await Branch.findOneAndUpdate({_id:id},{...req.body})
            if(patchBranch){
               const findBranchId = await Branch.findById({_id:patchBranch._id})
               const pastData = {...findBranchId.toObject()}
               delete pastData.__v;
                return res.status(200).json({
                    message:"Update Branch Successfully.",
                    data:pastData
                })
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const deleteBranchController = async(req,res) => {
    const {id} = req.params;
    if(!parseInt(id)){
        return res.status(404).json({message:"Not Found"})
    }

    try {
        const findBranch = await Branch.findById({_id:id})
        if(!findBranch){
            return res.status(404).json({
                message:"Branch Id does not exist."
            })
        }
        if(findBranch){
            const findUserBranch = await Users.find({branchName:id})
            if(findUserBranch.length > 0){
                return res.status(400).json({message:"Branch does not delete because User is already exist."})
            }
            const deleteBranch = await Branch.findOneAndDelete({_id:id})
            if(deleteBranch){
                return res.status(200).json({
                    message:"Delete Branch Successfully."
            })
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}