import bcrypt from 'bcrypt'
import { userDetails } from '../Models/UserModel.js'
import env from 'dotenv'
import jwt from 'jsonwebtoken'
import {transporter} from  "../mailer.js"
import { campaignDetails } from '../Models/CampaignModel.js'
import { donationHistoryDetails } from '../Models/DonationModel.js'
import { messageDetails } from '../Models/MessageModel.js'

env.config()

export const SignUp = async (req,res) => {
    try{
        const {body} = req
        body.password = await bcrypt.hash(body.password,10)
        const responce =await userDetails.create(body)
        if(!responce._id){
            return res.status(401).send({
                message:'Bad Request'
            })
        }
        responce.passord = null
        const token = jwt.sign({sub:responce},
            process.env.JWT_TOKEN,
            {expiresIn:'7d'})

        return res.status(201).send({
            message:'User LogedIn',
            user:responce,
            token
        })

    }
    catch(err){
        console.log(err)
        
        return res.status(500).send({
            message:'Internal Server Error',
            Error:err.message
        })
    }
}

export const Login = async (req,res) => {
    try{
        const {username,password} =req.query
        const user = await userDetails.findOne({username})
        if (user.isBlocked) {
            return res.status(403).send({
                 message: "User is blocked" 
            });
          }
        if(!user){
            return res.status(404).send({
                message:'User not found'
            })
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            return res.status(400).send({
                message:'Invalid Cridential'
            })
        }
        user.password = null
        const token = jwt.sign({sub:user},process.env.JWT_TOKEN,{expiresIn:'7d'})
        return res.status(200).send({
            message:'Logged In',
            user,
            token
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error',
            Error:err.message
        })
    }
}

export const updateUser = async (req,res) => {
    try{
        const {username,email,name} = req.body
        const {userId} = req.query

        const updatedUser = await userDetails.findByIdAndUpdate(userId,{$set:{username,email,name}},
            {new:true})
        if(!updatedUser){
            return res.status(400).send({
                message:'Invalid User'
            })
        }
        if(updatedUser.matchedCount===0){
            return res.status(404).send({
                message:'Not Found'
            })
        }
        return res.status(200).send({
            message:'Updated',
            updatedValue:updatedUser
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            message:'Internal Server Error'
        })
    }
}

export const ViewAcceptedCampaignForUser = async (req,res) => {
    try{
        const campaign = await campaignDetails.find({ status: "Accept"})
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
}

export const GetUserAllDonationHistory = async (req,res) =>{
    try{
        const { userId } = req.query
        const result = await donationHistoryDetails.find({ userId })
        if(!result){
            return res.status(401).send({
                message:'Field not found'
            })
        }
        return res.status(201).send({
            message:"Fetched Details Matched By UserId",
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

export const SendMessage= async (req,res) => {
    try{
        const { body } = req
    const responce = await messageDetails.create(body)
    if(!responce){
        return res.status(401).send({
            message:'Not Found'
        })
    }
    return res.status(201).send({
        message:'Message Sended',
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

export const forgetPassword = async (req,res) => {
    const {email} = req.body.values

    console.log(req.body.values);
    

    try{
        const user = await userDetails.findOne({email})
        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }

        const resetToken = jwt.sign({id:user._id},process.env.JWT_TOKEN, {expiresIn:'7d'})

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`

        await transporter.sendMail({
            from: '"Your App" <sendmailtome111@gmail.com>',
            to: user.email,
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


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body; 
    

    try {
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await userDetails.findById(decoded.id); 

        if (!user) {
            return res.status(400).send({ message: "Invalid token or user not found" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).send({ message: "Password Reset Successful" }); 
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};
