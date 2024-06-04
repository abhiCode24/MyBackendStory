import mongoose, { Schema, Types } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: Schema.Types.ObjectId,    // the one who subscribe the channel and ye bhi user hi toh hoga
        ref: 'User'
    },
    channel:{
        type:Schema.Types.ObjectId,     // the one who have channel jise subscriber subscribe krenge ye bhi user hi toh hoga
        ref:'User'
    }
},{timestamps:true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema)