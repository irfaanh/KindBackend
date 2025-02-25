import env from 'dotenv'
import jwt from 'jsonwebtoken'

env.config()

export const UserAuth = async(req,res,next) => {
    try{
        const tokenData = req.headers["authorization"]        
        const [_,token] =tokenData?.split(" ")
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        req.user = decoded;
        
        if (req.user.sub.role !== 'User' && req.user.sub.role !== 'Admin') {
            return res.status(403).send({
                message: `You can't update user details`
            });
        }
        
        const currentTime = Math.floor(new Date().getTime()/1000)
        if(decoded.exp <= currentTime){
            return res.status(401).send({
                message:'Unauthorized'
            })
        }
        next()
    }catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Unauthorized: Token has expired' });
        }

        if(err.message === "jwt malformed"){
            return res.status(400).send({
                message:'Unauthorized'
            })
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(400).send({ message: 'Unauthorized: Invalid token' });
        }
        return res.status(500).send({
            message:"Internal server error",
            error:err.message
          })
    }
}
