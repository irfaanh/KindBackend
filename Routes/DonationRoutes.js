import { Router } from "express";
import { AddDonationHistory, donateToCampaign, GetDonationDetByCampaignId } from "../Controllers/donation.controllers.js";

    export const DonationRoute = Router()

    DonationRoute.post('/donate',donateToCampaign)
    DonationRoute.post('/adddonation',AddDonationHistory)
    DonationRoute.get('/donationhistory',GetDonationDetByCampaignId)