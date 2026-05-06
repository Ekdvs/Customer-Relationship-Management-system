import mongoose from "mongoose"

//create database connection
const connectDB=async()=>{
    if(!process.env.MONGO_URI){
        throw new Error('please defind MONGO_URI variabel inside the .env file')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfull connect to the database')
        
    } catch (error) {
        console.error("Database Connection failed",error)
    }
}

export default connectDB;