import { model, Schema } from "mongoose";

const organizationSchema = new Schema(
    {
        name:{type:String,required:[true,"Name is Required"]},

        organizationname:{
        type:String,required:[true,"organization Name is required"]
        },

        email:{
        type:String,required:[true,"Email is required"],
        unique:[true,"email Must Be Unique"]
        },

        password:{
        type:String,required:[true,"Password is required"],
        unique:[true,"Password Must Be Unique"]
        },
        role: { 
            type: String, 
            enum: ["User", "Organization", "Admin"], 
            default: "Organization"
        }
    },
    {
        timestamps:true
    }
)

export const organizationDetails = model("organization",organizationSchema)