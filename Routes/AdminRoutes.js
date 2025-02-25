import { Router } from "express";
import {AdminAuth} from '../Middleware/AdminAuth.js'
import {
        AdminSignUp,AdminLogin,updateAdmin,
        getDonationSumOfCampaign,
        getUserDonationSum,
        manageUserDetails,
        manageOrganizationDetails,
        blockUser,
        unblockUser,
        ViewMessageByAdmin,
        viewOrganizationList,
        viewUsersList,
        manageCampaignDetails,
        disableCampaignByAdmin,
        enableCampaignByAdmin
        } from '../Controllers/Admin.controllers.js'
import { AcceptCampaign, PendingCampaign, RejectCampaign } from "../Controllers/Campaign.controllers.js";


        export const AdminRoute = Router()

        AdminRoute.post('/signup',AdminSignUp)
        AdminRoute.get('/login',AdminLogin)
        AdminRoute.patch('/update',AdminAuth,(req,res,next)=>{
                console.log('Authenticated Admin:', req.user)
                updateAdmin(req,res,next)
                })    
        AdminRoute.get('/pendingcampaign',PendingCampaign)  
        AdminRoute.patch('/acceptcampaign',AcceptCampaign)    
        AdminRoute.patch('/rejectcampaign',RejectCampaign)    
        AdminRoute.get('/getdonationsumofcampaign',getDonationSumOfCampaign)    
        AdminRoute.get('/getuserdonationsum',getUserDonationSum)    
        AdminRoute.get('/getuserdetail',manageUserDetails)    
        AdminRoute.get('/getorganizationdetail',manageOrganizationDetails)    
        AdminRoute.get('/getcampaigndetail',manageCampaignDetails)    
        AdminRoute.patch('/blockuser',blockUser)    
        AdminRoute.patch('/unblockuser',unblockUser)    
        AdminRoute.get('/organizationdetails',viewOrganizationList)    
        AdminRoute.get('/userdetails',viewUsersList)    
        AdminRoute.get('/viewmessage',ViewMessageByAdmin)    
        AdminRoute.patch('/disablecampaignbyadmin',disableCampaignByAdmin)    
        AdminRoute.patch('/enablecampaignbyadmin',enableCampaignByAdmin)    
         