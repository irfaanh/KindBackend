import bcrypt from 'bcrypt'
import env from 'dotenv'
import jwt from 'jsonwebtoken'
import {transporter} from  "../mailer.js"
import {organizationDetails} from '../Models/OrganizationModel.js'
import { campaignDetails } from '../Models/CampaignModel.js'
import { AcceptCampaign } from './Campaign.controllers.js'

env.config()

export const OrganizationSignUp = async (req,res) => {
    try{
        const {body} = req
        body.password = await bcrypt.hash(body.password,10)
        const responce =await organizationDetails.create(body)
        if(!responce._id){
            return res.status(401).send({
                message:'Bad Request'
            })
        }
        responce.passord = null
        const token = jwt.sign({sub:responce},process.env.JWT_TOKEN,{expiresIn:'7d'})
        return res.status(201).send({
            message:'Organization LoggedIn',
            organization:responce,
            token
        })

    }
    catch(err){
        console.log(err);
        
        return res.status(500).send({
            error:err,
            message:'Internal Server Error'
        })
    }
}

export const OrganizationLogin = async (req,res) => {
    try{
        const {organizationname,password} =req.query
        const organization = await organizationDetails.findOne({organizationname})
        if(!organization){
            return res.status(404).send({
                message:'User not found'
            })
        }
        const validPassword = await bcrypt.compare(password,organization.password)
        if(!validPassword){
            return res.status(400).send({
                message:'Invalid Cridential'
            })
        }
        organization.password = null
        const token = jwt.sign({sub:organization},process.env.JWT_TOKEN,{expiresIn:'7d'})
        return res.status(200).send({
            message:'Logged In',
            organization,
            token
        })
    }catch(err){
        return res.status(500).send({
            message:'Internal Server Error',
            Error:err.message
        })
    }
}

export const Organizationupdate = async (req,res) => {
    try{
        const {organizationname,name,email} = req.body
        const {orgId} = req.query

        const responce = await organizationDetails.findByIdAndUpdate(orgId,{$set:{organizationname,email,name}},
            {new:true}
        )
        if(!responce){
            return res.status(400).send({
                message:'Invalid User'
            })
        }
        if(responce.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Updated',
            updateOrg:responce
        })
    }
    catch(err){
        console.log(err);
        
        return res.status(500).send({
            message:'Internal Server Error1'
        })
    }
}

export const ViewAcceptedCampaignForOrg = async (req,res) => {
    try{
        const {id} = req.query
        const campaign = await campaignDetails.find({ organizationId: id, status: "Accept" , 
            isEnabled: 'Enable' , isDisableByAdmin: 'Enable'})
        console.log(campaign);
        
        return res.status(201).send({
            message:"Fetched Pending Campaigns",
            AcceptedCampaigns:campaign
            
            
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            message:'Internal Server Error'
        })
        
    }
    console.log(AcceptCampaign);
}

export const campaignMoreDetailForOrg = async (req,res) => {
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
            campDetailsForOrg:campaignDetail
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
        
    }
}

export const CampaignUpdate = async (req,res) => {
    try{
        console.log(req.body);
        
        const {campaignName,title,description,image,targetAmount,email,location} = req.body
        const {id} = req.query
        console.log(id);
        
        const responce = await campaignDetails.findByIdAndUpdate(id,
            {$set:{campaignName,title,description,image,targetAmount,email,location}},
            {new:true}
        )
        console.log(responce);
        
        if(!responce){
            return res.status(400).send({
                message:'Invalid Campa'
            })
        }
        if(responce.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Updated',
            updateCampaign:responce
        })
    }
    catch(err){
        console.log(err);
        
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const DisableCampaign = async(req,res) => {
    try{
        const {isEnabled} = req.body
        const {id} = req.query

        const responce = await campaignDetails.updateOne({_id:id},{$set:{isEnabled}})
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
            message:'Updated'
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const ViewDisabledCampaignForOrg = async (req,res) => {
    try{
        const campaign = await campaignDetails.find({ status: "Accept" , isEnabled: 'Disable'})
        console.log(campaign);
        
        return res.status(201).send({
            message:"Fetched Disabled Campaigns",
            DisabledCampaigns:campaign
            
            
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            message:'Internal Server Error'
        })
        
    }
    console.log(AcceptCampaign);
}


export const forgetOrgPassword = async (req,res) => {
    const {email} = req.body.values

    console.log(req.body.values);
    

    try{
        const organization = await organizationDetails.findOne({email})
        if(!organization){
            return res.status(404).send({
                message:"User not found"
            })
        }

        const resetToken = jwt.sign({id:organization._id},process.env.JWT_TOKEN, {expiresIn:'7d'})

        const resetLink = `http://localhost:5173/organization/resetorg-password/${resetToken}`

        await transporter.sendMail({
            from: '"Your App" <sendmailtome111@gmail.com>',
            to: organization.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>If you did not request this, please ignore this email.</p>`,
          });

          return res.status(200).send({
            message:'Rest Link send to your mail'
          })



    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
        
    }
}


export const resetOrgPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body; 
    

    try {
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const organization = await organizationDetails.findById(decoded.id); 

        if (!organization) {
            return res.status(400).send({ message: "Invalid token or user not found" });
        }

        const salt = await bcrypt.genSalt(10);
        organization.password = await bcrypt.hash(newPassword, salt);
        await organization.save();

        return res.status(200).send({ message: "Password Reset Successful" }); 
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};