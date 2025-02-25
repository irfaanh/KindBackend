import { AdminDetails } from "../Models/AdminModel.js"
import bcrypt from 'bcrypt'
import env from 'dotenv'
import jwt from 'jsonwebtoken'
import { campaignDetails } from "../Models/CampaignModel.js"
import { donationHistoryDetails } from "../Models/DonationModel.js"
import { userDetails } from "../Models/UserModel.js"
import { organizationDetails } from "../Models/OrganizationModel.js"
import { messageDetails } from "../Models/MessageModel.js"

env.config()


export const AdminSignUp = async (req,res) => {
    try{
        const {body} = req
        body.password = await bcrypt.hash(body.password,10)
        const responce =await AdminDetails.create(body)
        if(!responce._id){
            return res.status(401).send({
                message:'Bad Request'
            })
        }
        responce.passord = null
        const token = jwt.sign({sub:responce},process.env.JWT_TOKEN,{expiresIn:'7d'})
        return res.status(201).send({
            message:'Admin LogedIn',
            Admin:responce,
            token
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const AdminLogin = async (req,res) => {
    try{
        const {username,password} =req.query
        const Admin = await AdminDetails.findOne({username})
        if(!Admin){
            return res.status(404).send({
                message:'Admin not found'
            })
        }
        const validPassword = await bcrypt.compare(password,Admin.password)
        if(!validPassword){
            return res.status(400).send({
                message:'Invalid Cridential'
            })
        }
        Admin.password = null
        const token = jwt.sign({sub:Admin},process.env.JWT_TOKEN,{expiresIn:'7d'})
        return res.status(200).send({
            message:'Logged In',
            Admin,
            token
        })
    }catch(err){
        console.log(err);

        return res.status(500).send({
            message:'Internal Server Error',
            Error:err.message
        })
    }
}

export const updateAdmin = async (req,res) => {
    try{
        const {username,email} = req.body
        const {id} = req.query

        const responce = await AdminDetails.updateOne({_id:id},{$set:{username,email}})
        if(!responce){
            return res.status(400).send({
                message:'Invalid Admin'
            })
        }
        if(responce.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Updated'
        })

    }
    catch(err){
        console.log(err);

        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const getDonationSumOfCampaign = async (req, res) => {
    try {
      const result = await campaignDetails.aggregate([
        {
          $group: {
            _id: "$campaignName", 
            totalAmount: { $sum: "$collectedAmount" }, 
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


export const getUserDonationSum = async (req, res) => {
    try {
      const result = await donationHistoryDetails.aggregate([
        {
          $group: {
            _id: "$userId", 
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


export const manageUserDetails = async (req,res) => {
    try{
        const usersDetail = await userDetails.aggregate([
            {
                $group: {
                  _id: null, 
                  allUsers: { $push: "$$ROOT" } 
                }
              }
        ])
        return res.status(200).send({
            message:"Success",
            usersDetail
          });
    }catch(err){
        console.log(err);
      console.error("Error fetching user data:", err);
      res.status(500).send("Server Error");
    }
}

export const manageOrganizationDetails = async (req,res) => {
    try{
        const organizationDetail = await organizationDetails.aggregate([
            {
                $group: {
                  _id: null, 
                  allOrganization: { $push: "$$ROOT" } 
                }
              }
        ])
        return res.status(200).send({
            message:"Success",
            organizationDetail
          });
    }catch(err){
        console.log(err);
      console.error("Error fetching user data:", err);
      res.status(500).send("Server Error");
    }
}

export const manageCampaignDetails = async (req,res) => {
    try{
        const campaignDetail = await campaignDetails.aggregate([
            {
                $match: { status : "Accept"}
            },
            {
                $group: {
                  _id: null, 
                  allCampaign: { $push: "$$ROOT" } 
                }
              }
        ])
        return res.status(200).send({
            message:"Success",
            campaignDetail
          });
    }catch(err){
        console.log(err);
      console.error("Error fetching user data:", err);
      res.status(500).send("Server Error");
    }
}

export const blockUser = async (req,res) => {
    try{
        const {id} = req.body;
        const result = await userDetails.findByIdAndUpdate(id, {isBlocked: true})
        if(!result){
            return res.status(401).send({
                message:'User not found'
            })
        }
        return res.status(200).send({
            message:"User has been blocked",
            result
        })
    }catch(err){
        console.log(err);
      console.error("Error fetching on blocking user:", err);
      res.status(500).send("Server Error");
    }
}

export const unblockUser = async (req,res) => {
    try{
        const {id} = req.body;
        const result = await userDetails.findByIdAndUpdate(id, {isBlocked: false})
        if(!result){
            return res.status(401).send({
                message:'User not found'
            })
        }
        return res.status(200).send({
            message:"User has been unblocked",
            result
        })
    }catch(err){
        console.log(err);
      console.error("Error fetching on blocking user:", err);
      res.status(500).send("Server Error");
    }
}

export const viewOrganizationList = async (req,res) => {
    const {orgId} = req.query
    const result = await organizationDetails.find({_id : orgId})
    if(!result){
        return res.status(401).send({
            message:'Organization not found'
        })
    }
    return res.status(200).send({
        message:'Success',
        result
    })
}

export const viewUsersList = async (req,res) => {
    const {userId} = req.query
    const result = await userDetails.find({_id : userId})
    if(!result){
        return res.status(401).send({
            message:'User not found'
        })
    }
    return res.status(200).send({
        message:'Success',
        result
    })
}

export const disableCampaignByAdmin = async (req,res) => {
    try{
        const {id} = req.query
        const {isDisableByAdmin,isEnabled} = req.body

        const responce = await campaignDetails.findByIdAndUpdate(id,{$set:{isDisableByAdmin,isEnabled}},
            {new:true}
        )
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
            message:'Accepted',
            disabledByUser:responce
        })
    }catch(err){
        console.log(err)
        
    }
    

}

export const enableCampaignByAdmin = async (req,res) => {
    try{
        const {id} = req.query
        const {isDisableByAdmin,isEnabled} = req.body

        const responce = await campaignDetails.findByIdAndUpdate(id,{$set:{isDisableByAdmin,isEnabled}},
            {new:true}
        )
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
            message:'Accepted',
            disabledByUser:responce
        })
    }catch(err){
        console.log(err)
        
    }
    

}

export const ViewMessageByAdmin = async (req,res) => {
    const msg = await messageDetails.find()
    if(!msg){
        return res.status(401).send({
            message:'Not found'
        })
    }
    return res.status(200).send({
        message:'Success',
        msg
    })
}


