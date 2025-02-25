import { model, Schema } from "mongoose";

const campaignSchema = new Schema(
    {
        organizationname:{
            type:String,required:[true,"organization name is required"]
        },
        campaignName:{
            type:String,required:[true,"campaign Name required"],
            unique:true
        },
        title:{
            type:String,required:[true,"title is required"],
            unique:true
        },

        description:{
            type:String,required:[true,"description is required"],
            unique:true
        },

        image:{type:String,required:[true,"image is required"]},

        targetAmount:{type:Number,required:[true,"targetAmount is required"]},

        collectedAmount:{type:Number,required:[true,"collectedAmount is required"]},

        organizationId:{type:String,required:[true,"organizationId id is required"]},

        email:{type:String,required:[true,"email id is required"]},

        location:{type:String,required:[true,"location id is required"]},


        status:{type: String, 
            enum: ["Pending", "Accept", "Rejected"], 
            default: "Pending"},

        isEnabled:{type:String,
            enum: ["Enable","Disable"],
            default: "Enable"
        },
        isDisableByAdmin:{type:String,
            enum: ["Enable","Disable"],
            default: "Enable"
        },
    },
    {
        timestamps:true
    }
)

export const campaignDetails = model("campaign",campaignSchema)