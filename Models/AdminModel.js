import { model, Schema } from "mongoose";

const AdminSchema = new Schema(
    {
        name:{type:String,required:[true,"Name is Required"]},

        username:{
        type:String,required:[true,"Username is required"],
        unique:[true,"Username Must Be Unique"]
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
            default: "Admin"
        }
    },
    {
        timestamps:true
    }
)

export const AdminDetails = model("Admin",AdminSchema)