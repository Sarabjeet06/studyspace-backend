import express from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignment.js";
import Classroom from "../models/classroom.js";
import nodemailer from "nodemailer";
import classUser from "../models/class_user.js";
import { sendAssignmentNotificationMail } from "../utils/emailtemplates/assignment_invite.js";
import { getUserIdFromToken } from "./users.js";

const router=express.Router();


const sendInvitationEmail = async (email , assignment, classroom_id ,  url , classroom_name) => {
    try {
       const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
             user: "studyspace39@gmail.com",
             pass: process.env.NODEMAILER_PASSWORD,
          },
       });
       const mailOptions = {
          from: "studyspace39@gmail.com",
          to: email,
          subject: "New Assignment Notification",
          html: sendAssignmentNotificationMail(assignment, classroom_id ,  url ,classroom_name),
       };
       await transporter.sendMail(mailOptions);
    } catch (error) {
       console.error(`Error sending invitation email to ${email}: ${error}`);
    }
 };


router.post("/add_assignment",async (req,res)=>{
    var user_id = null;
    try {
       user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
    } catch (err) {
       return res.status(401).json({
          ok: false,
          msg: "Token is malformed or expired",
       });
    }
    const {assignment_name , assignment_date , assignment_desc,assignment_point,assignment_url,classroom_id}=req.body;
    try{
        const assignment_id = Date.now().toString().substring(6);
        const Classroom_exist = await Classroom.findOne({classroom_id : classroom_id});
        if(!Classroom_exist){
            return res.status(404).json({message: "Classroom not found"});
        }
        var new_class = {
            classroom_id: classroom_id,
            assignment_id: assignment_id,
            heading: assignment_name,
            description : assignment_desc,
            deadline : assignment_date,
            total_points : assignment_point,
            status : "ongoing",
            question_url : assignment_url,
        };
        const assignment=new Assignment(new_class);
        await assignment.save();
        const members = await classUser.find({ classroom_id: Classroom_exist._id }).populate('member_id');
        await Promise.all(
          members.map((member) =>
            sendInvitationEmail(member.member_id.email ,  assignment, classroom_id ,  process.env.FRONTEND_URL , Classroom_exist?.classroom_name)
          )
        );
        res.status(201).json(assignment);
    }catch(error){
        console.log(error);
        res.status(500).send({message: error});
    }
});

router.get("/getAssignment", async (req,res) =>{
    var user_id = null;
    try {
       user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
    } catch (err) {
       return res.status(401).json({
          ok: false,
          msg: "Token is malformed or expired",
       });
    }
    try{
        const {classroom_id} = req.query;
        const assignments=await Assignment.find({classroom_id : classroom_id});
        return res.status(200).json(assignments);
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

router.delete("/deleteAssignment/:id", async (req,res) =>{
    var user_id = null;
    try {
       user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
    } catch (err) {
       return res.status(401).json({
          ok: false,
          msg: "Token is malformed or expired",
       });
    }
    try{
        const {id}=req.params;
        const assignment= await Assignment.findByIdAndDelete(id);
        if(!assignment){
            return res.status(404).json({message: "Assignment not found"});
        }
        res.status(200).json({message: "Assignment deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

router.put("/updateAssignment/:id", async (req,res) =>{
    var user_id = null;
    try {
       user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
    } catch (err) {
       return res.status(401).json({
          ok: false,
          msg: "Token is malformed or expired",
       });
    }
    const {id} =req.params;
    const {assignment_name , assignment_date}=req.body;
    try{
        const assignment= await Assignment.findById(id);
        if(!assignment){
            return res.status(404).json({message: "Assignment not found"});
        }
        assignment.heading=assignment_name;
        assignment.deadline=assignment_date;
        const updatedAssignment=await assignment.save();
        res.status(200).json(updatedAssignment);
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

export default router;