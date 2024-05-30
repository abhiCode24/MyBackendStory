import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,    // cloudinary url
        required: true
    },
    thumbnail:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    discription:{
        type: String,
        required:true
    },
    duration:{
        type: Number,
        required:true
    },
    views:{
        type:Number,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true});

mongoose.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video', videoSchema);