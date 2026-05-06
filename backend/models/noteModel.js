import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        content:{
            type:String,
            required:[  true,"Please enter note content"]
        },
        lead:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lead",
            required:true
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        type:{
            type:String,
            enum:["call", "email", "meeting", "note"],
            default:"note"
            }


    },
    {timestamps:true}
)

const Note = mongoose.model("Note",noteSchema)

export default Note