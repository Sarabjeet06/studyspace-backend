import express from "express";
import cors from "cors";
import 'dotenv/config';
import { connectToDb } from "./utils/dbConnect.js";
import usersroute from "./routes/users.js";
import classroomsroute from "./routes/classrooms.js";
import assignmentsroute from "./routes/assignments.js";
import quizesroute from "./routes/quizes.js";
import membersroute from "./routes/members.js"
import announcementsroute from "./routes/anouncement.js"
import submitroute from "./routes/submission.js";
const app=express();
const port = 3001;

var corsOptions = {
    origin: ['http://localhost:3000/' , 'https://studyspace-frontend.vercel.app'],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.json());
connectToDb();

app.use("/api/users",usersroute);
app.use("/api/classrooms",classroomsroute);
app.use("/api/assignments",assignmentsroute);
app.use("/api/quizes",quizesroute);
app.use("/api/anouncements" , announcementsroute);
app.use("/api/members" , membersroute);
app.use('/api/submissions',submitroute);

app.get("/",(req,res)=>{
    res.status(200).json({message: "Backend is running successfully"});
})

app.listen(port, ()=>{
    console.log(`The server is running on port ${port}`);
});