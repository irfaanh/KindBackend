import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sendmailtome111@gmail.com",
        pass:"jmye dtms rekg jhhz"
    }
})

