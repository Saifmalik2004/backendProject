import mongoose,{Schema} from "mongoose";
import { User } from "./userModel";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
video:{
    type:String,
    require:true,

},
thumbnail:{
    type:String,
    require:true,
    
},
title:{
    type:String,
    require:true,

},
description:{
    type:String,
    require:true,

},
duration:{
    type:String,
    require:true,

},
views:{
    type:Number,
    default:0
},
isPublished:{
    type:Boolean,
    default:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:User
}
    },
    {timestamps:true}
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video= mongoose.model("Video",videoSchema)