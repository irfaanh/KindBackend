import express from 'express'
import env from 'dotenv'
import ConnectDataBase from './Config/dataBase.config.js'
import { UserRoute } from './Routes/UserRoutes.js'
import { AdminRoute } from './Routes/AdminRoutes.js'
import { OrganizationRoute } from './Routes/OrganizationRoutes.js'
import cors from 'cors'
import { DonationRoute } from './Routes/DonationRoutes.js'

env.config()

await ConnectDataBase()

const app = express()

app.use(express.json())

app.use("/assets", express.static("./assets"))

app.use(cors())

app.use('/user',UserRoute)

app.use('/organization',OrganizationRoute)

app.use('/admin', AdminRoute)

app.use('/donation', DonationRoute)


app.listen(process.env.PORT || 3500 , (err) => {
    if(err){
        return process.exit(1)
    }
    console.log(`Server Running on ${process.env.PORT}`);    
})