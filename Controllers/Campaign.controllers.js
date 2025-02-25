import {campaignDetails} from '../Models/CampaignModel.js'
import env from 'dotenv'
import { donationHistoryDetails } from '../Models/DonationModel.js'
import { organizationDetails } from '../Models/OrganizationModel.js'

env.config()

export const AddNewCampaign = async (req,res) => {
    try{
        const {body} = req
        const responce = await campaignDetails.create(body)
        if(!responce._id){
            return res.status(400).send({
                message:'Bad Request'
            })
        }
        return res.status(201).send({
            message:'Campaign Added',
            CampaignDetails:responce
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const PendingCampaign = async (req,res) => {
    try{
        const campaign = await campaignDetails.find({ status: "Pending"})
        return res.status(201).send({
            message:"Fetched Pending Campaigns",
            PendingCampaigns:campaign
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            message:'Internal Server Error'
        })
        
    }
}

export const AcceptCampaign = async(req,res) => {
    try{
        const {status} = req.body
        const {id} = req.query

        const responce = await campaignDetails.updateOne({_id:id},{$set:{status}})
        if(!responce){
            return res.status(400).send({
                message:'Invalid Campaign'
            })
        }
        if(responce.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Accepted'
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const RejectCampaign = async(req,res) => {
    try{
        const {status} = req.body
        const {id} = req.query

        const responce = await campaignDetails.updateOne({_id:id},{$set:{status}})
        if(!responce){
            return res.status(400).send({
                message:'Invalid Campaign'
            })
        }
        if(responce.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Rejected'
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const campaignMoreDetail = async (req,res) => {
    try{
        const {id} = req.query
        const campaignDetail = await campaignDetails.findOne({ _id : id })
        if(!campaignDetail){
            return res.status(401).send({
                message:"Campaign not found"
            })
        }
        return res.status(200).send({
            message:'Campaign Fetched',
            campDetails:campaignDetail
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
        
    }
}

export const GetCampaignCollection = async (req,res) =>{
    try{
        const {campaignId } = req.query
        const collection = await donationHistoryDetails.find({campaignId })
        if(!collection){
            return res.status(401).send({
                message:'Field not found'
            })
        }
        return res.status(201).send({
            message:"Fetched Collection By CampaignId",
            collection
        })
    }catch(err){
        console.log(err)
        
        return res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export const getDonationsByDate = async (req, res) => {
    try {
        const { campaignId } =req.query
      const result = await donationHistoryDetails.aggregate([
        {
            $match: {
              campaignId, 
            },
        },
        {
          $group: {
            _id: "$donationDate", 
            totalAmount: { $sum: "$amount" }, 
          },
        },
        {
          $sort: { _id: 1 }
        },
      ])
      
      return res.status(200).send({
        message:"Success",
        result
      });
    } catch (error) {
        console.log(error);
        
      console.error("Error fetching donation data:", error);
      res.status(500).send("Server Error");
    }
  };
  

