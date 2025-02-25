import { Router } from "express";
import {UserAuth} from '../Middleware/UserAuth.js'
import {
        SignUp,Login,updateUser,
        ViewAcceptedCampaignForUser,
        GetUserAllDonationHistory,
        SendMessage,
        forgetPassword,
        resetPassword
        } from '../Controllers/User.controllers.js'
import { campaignMoreDetail } from "../Controllers/Campaign.controllers.js";


        export const UserRoute = Router()

        UserRoute.post('/signup',SignUp)
        UserRoute.get('/login',Login)
        UserRoute.patch('/update',UserAuth,(req,res,next)=>{
                console.log('Authenticated User:', req.user)
                updateUser(req,res,next)
                })    
        UserRoute.get('/acceptedcampaignuser',ViewAcceptedCampaignForUser)
        UserRoute.get('/getcampaigndetails',campaignMoreDetail)
        UserRoute.get('/getusertransactiondetails',GetUserAllDonationHistory)
        UserRoute.post('/message',SendMessage)
        UserRoute.post('/forgetpassword',forgetPassword)
        UserRoute.post('/resetpassword/:token',resetPassword)
                
         