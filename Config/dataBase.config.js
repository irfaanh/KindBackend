import {connect} from 'mongoose'
import env from 'dotenv'

env.config()

const ConnectDataBase = async () => {
    try{
        const {connection} = await connect(process.env.CLUSTER_URL,{
            dbName:'Kind'
        })
        const dataBase = connection.db.databaseName
        console.log("Connected database : ",dataBase)
        
    }
    catch(err){
        console.log(err);
                
    }
}

export default ConnectDataBase