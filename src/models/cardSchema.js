import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
   userId:{
        type:mongoose.Schema.Types.ObjectId,
        refs:'Users'
    },
    cardNo:{
        type:String
    },
    cardType:{
        type:String,
        require:true
    },
    cardBalance:{
        type:String,
        default:0
    },
    cardExpiryDate:{
        type:Date
    }
},{timestamps:true})


const Card = mongoose.model('Card',cardSchema)
export default Card;