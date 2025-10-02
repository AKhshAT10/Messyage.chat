import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from 'cors';
import { app , server} from "./lib/socket.js";
import path from "path";


//cookie parser helps us parse the cookie , unjumble it ig

dotenv.config();



const PORT = process.env.PORT||5001;
const _dirname = path.resolve();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));

app.use("/api/auth",authRoutes);

app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(_dirname,"../frontend","dist","index.html"));
    });
}

server.listen(PORT,()=>{
    console.log("server is running on PORT " + PORT);
    connectDB();
});
