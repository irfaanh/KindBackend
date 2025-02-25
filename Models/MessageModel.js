import { model, Schema } from "mongoose";

const messageSchema = new Schema(
    {
        userid:{type:String,required:[true,"User id is required"]},

        full_name:{type:String,required:[true,"name id is required"]},

        email:{type:String,required:[true,"Email is required"]},

        message:{type:String,required:[true,"Message is required"]},

        from:{type:String,required:[true,"from is required"]},


    },
    {
        timestamps:true
    }
)

export const messageDetails = model("message",messageSchema)