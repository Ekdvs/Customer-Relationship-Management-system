import { configDotenv } from "dotenv";
import express from "express"
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";

configDotenv();
const app =express();

//add middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//api routes

app.use("/api/users",userRouter);

//test route
app.get("/",(req,res)=>{
    res.send("Welcome to CRM system")
})

connectDB().then(
    ()=>{
        app.listen(process.env.PORT || 8080,()=>{
            console.log(`Server is running on port ${process.env.PORT || 8080}`)
        })
    }
)