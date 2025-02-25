import { Router } from "express";
import {OrganizationAuth} from '../Middleware/OrganizationAuth.js'
import {
        OrganizationSignUp,OrganizationLogin,Organizationupdate,
        ViewAcceptedCampaignForOrg,
        campaignMoreDetailForOrg,
        CampaignUpdate,
        DisableCampaign,
        ViewDisabledCampaignForOrg,
        forgetOrgPassword,
        resetOrgPassword
        } from '../Controllers/Organization.controllers.js'
import { AddNewCampaign, GetCampaignCollection, getDonationsByDate} from '../Controllers/Campaign.controllers.js'


        export const OrganizationRoute = Router()

        OrganizationRoute.post('/signup',OrganizationSignUp)
        OrganizationRoute.get('/login',OrganizationLogin)
        OrganizationRoute.patch('/update',OrganizationAuth,(req,res,next)=>{
                console.log('Authenticated Organization:', req.organization)
                Organizationupdate(req,res,next)
                })  
        OrganizationRoute.post('/addnewcampaign',AddNewCampaign)
        OrganizationRoute.get('/acceptedcampaignorg',ViewAcceptedCampaignForOrg)
        OrganizationRoute.get('/campaigncollection',GetCampaignCollection)
        OrganizationRoute.get('/gettotalamountbydate',getDonationsByDate)
        OrganizationRoute.get('/getcampaigndetailsfororg',campaignMoreDetailForOrg)
        OrganizationRoute.patch('/updatecampaign',CampaignUpdate)
        OrganizationRoute.patch('/disablecampaign',DisableCampaign)
        OrganizationRoute.get('/getdisable',ViewDisabledCampaignForOrg)
        OrganizationRoute.post('/forgetpassword',forgetOrgPassword)
        OrganizationRoute.post('/resetpassword/:token',resetOrgPassword)


                
         