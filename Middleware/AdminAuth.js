import env from 'dotenv'
import jwt from 'jsonwebtoken'

env.config()

export const AdminAuth = async(req,res,next) => {
    try{
        const tokenData = req.headers["authorization"]        
        const [_,token] =tokenData?.split(" ")
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        req.admin = decoded;

        if(req.admin.sub.role !== 'Admin'){
            return res.status(403).send({
                message:`You can't update Admin details`
            })
        }

        const responce = jwt.verify(token,process.env.JWT_TOKEN)
        const currentTime = Math.floor(new Date().getTime()/1000)
        if(responce.exp <= currentTime){
            return res.status(401).send({
                message:'Unauthorized'
            })
        }
        next()
    }catch(err){
        if(err.message === "jwt malformed"){
            return res.status(400).send({
                message:'Unauthorized'
            })
        }
        return res.status(500).send({
            message:"Internal server error",
            error:err.message
          })
    }
}

export const authorizeRole = (...allowedRoles) => {
    return (req,res,next) => {
        if(!allowedRoles.includes(req.admin.role)){
            return res.status(403).send({
                message:'Access Denied'
            })
        }
        next()
    }
}