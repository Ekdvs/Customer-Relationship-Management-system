import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[  true,"Please enter your name"]
        },
        email:{
            type:String,
            required:[  true,"Please enter your email"],
            unique:true
        },
        password:{
            type:String,
            required:[  true,"Please enter your password"],
            minlength:6,
            select: false
        },
        role:{
            type:String,
            enum:["Admin","Sales"],
            default:"Sales"
        }
    },
    {timestamps:true}

)



const User = mongoose.model("User",userSchema)



export default User