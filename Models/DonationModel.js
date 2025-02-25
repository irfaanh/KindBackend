import { model, Schema } from "mongoose";

const donationSchema = new Schema(
    {
        userId:{type:String,required:[true,"User id is required"]},

        campaignId:{type:String,required:[true,"campaign id is required"]},

        amount:{type:Number,required:[true,"Amount is required"]},

        donationDate:{type:String,required:[true,"Date is required"]},

    },
    {
        timestamps:true
    }
)

export const donationHistoryDetails = model("donation",donationSchema)