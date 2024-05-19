import express from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignment.js";

const router=express.Router();

router.post("/add_assignment",async (req,res)=>{
    const {assignment_name , assignment_date}=req.body;
    try{
        const assignment_id = Date.now().toString().substring(6);
        const assignment=new Assignment({assignment_id,assignment_name, assignment_date});
        await assignment.save();
        console.log(assignment);
        res.status(201).json(assignment);
    }catch(error){
        console.log(error);
        res.status(500).send({message: error});
    }
});

router.get("/getAssignment", async (req,res) =>{
    try{
        const assignments=await Assignment.find();
        console.log(assignments);
        return res.status(200).json(assignments);
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

router.delete("/deleteAssignment/:id", async (req,res) =>{
    try{
        console.log("yaha toh aa raha hoon bhai");
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
    const {id} =req.params;
    const {assignment_name , assignment_date}=req.body;
    try{
        const assignment= await Assignment.findById(id);
        if(!assignment){
            return res.status(404).json({message: "Assignment not found"});
        }
        assignment.assignment_name=assignment_name;
        assignment.assignment_date=assignment_date;
        const updatedAssignment=await assignment.save();
        res.status(200).json(updatedAssignment);
        console.log("update kardia");
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

export default router;