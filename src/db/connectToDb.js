import mongoose from "mongoose"

const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(()=>{
            console.log('mongoose is connected.')
        })
    } catch (error) {
        console.log(error,'mongo error is')
        process.exit(1)
    }
}

export default connectToDb;