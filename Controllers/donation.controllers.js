import stripe from "stripe";
import { campaignDetails } from "../Models/CampaignModel.js";
import dotenv from "dotenv";
import { donationHistoryDetails } from "../Models/DonationModel.js";

dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const donateToCampaign = async (req, res) => {
    try {
        const { campaignId, amount, token } = req.body;

        const charge = await stripeInstance.charges.create({
            amount: amount * 100, 
            currency: "usd",
            source: token,
            description: `Donation for Campaign ID: ${campaignId}`,
        });

        const campaign = await campaignDetails.findById(campaignId);
        if (!campaign) {
            return res.status(404).send({
                message: "Campaign not found",
            });
        }

        if (campaign.collectedAmount + amount > campaign.targetAmount) {
            return res.status(400).send({
                message: "Collected Amount Exceeds Targeted Amount",
            });
        }

        campaign.collectedAmount += amount;
        await campaign.save();


        return res.status(200).send({
            message: "Donation successful",
            campaign,
        });
    } catch (error) {
        console.error("Error in donation process:", error);

        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const AddDonationHistory = async (req,res) => {
    try{
        const {body} = req
        const responce = await donationHistoryDetails.create(body)
        if(!responce._id){
            return res.status(401).send({
                message:"Not Found"
            })
        }
        return res.status(201).send({
            message:"Donation details added",
            responce
        })

    }catch(err){
        console.log(err)
        
        return res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export const GetDonationDetByCampaignId = async (req,res) =>{
    try{
        const {userId , campaignId } = req.query
        const result = await donationHistoryDetails.find({ userId, campaignId })
        if(!result){
            return res.status(401).send({
                message:'Field not found'
            })
        }
        return res.status(201).send({
            message:"Fetched Details Matched By UserId and CampaignId",
            result
        })
    }catch(err){
        console.log(err)
        
        return res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}
