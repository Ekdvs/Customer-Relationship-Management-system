import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        leadName:{
            type:String,
            required:[  true,"Please enter lead name"]
        },
        companyName:{
            type:String,
            required:[  true,"Please enter company name"]
        },
        email:{
            type:String,
            required:[  true,"Please enter email"],
        },
        phoneNumber:{
            type:String,
            required:[  true,"Please enter phone number"],
        },
        leadSource:{
            type:String,
            enum:["Website", "LinkedIn", "Referral", "Other"],
        },
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        status:{
            type:String,
            enum:["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"],
            default:"New"
        },
        dealValue:{
            type:Number,
        },
        score:{
            type:Number,
            default:0
        },
        priority:{
            type:String,
            enum:["Low", "Medium", "High"],
            default:"Medium"
        },
        followUpDate:{
            type:Date,
        },
        tags:[{
            type:String,
        }],
    },
    {timestamps:true}
)

const Lead = mongoose.model("Lead",leadSchema)

export default Lead