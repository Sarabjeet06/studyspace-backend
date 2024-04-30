import express from "express";
import cors from "cors";
import 'dotenv/config';
import { connectToDb } from "./utils/dbConnect.js";
import usersroute from "./routes/users.js"

const app=express();
const port = 3001;

app.use(cors());
app.use(express.json());
connectToDb();

app.use("/api/users",usersroute);

app.listen(port, ()=>{
    console.log(`The server is running on port ${port}`);
});