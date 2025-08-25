import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./src/routes/message.route.js";
import cors from 'cors';
import { app , server} from "./src/lib/socket.js";


//cookie parser helps us parse the cookie , unjumble it ig

dotenv.config();



const PORT = process.env.PORT||5001;

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));

app.use("/api/auth",authRoutes);

app.use("/api/messages",messageRoutes);

server.listen(PORT,()=>{
    console.log("server is running on PORT " + PORT);
    connectDB();
});
