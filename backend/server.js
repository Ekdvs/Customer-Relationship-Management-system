import { configDotenv } from "dotenv";
import express from "express"
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import activityRouter from "./routes/activityRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import leadRouter from "./routes/leadRoutes.js";
import noteRouter from "./routes/noteRoutes.js";

configDotenv();
const app =express();

//add middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//api routes

app.use("/api/users",userRouter);
app.use("/api/auth", userRouter);
app.use("/api/leads", leadRouter);
app.use("/api/notes", noteRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/activities", activityRouter);

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