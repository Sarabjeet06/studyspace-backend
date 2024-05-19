import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/quiz.js";

const router=express.Router();

router.post("/add_quiz",async (req,res)=>{
    const {quiz_question,quiz_option1,quiz_option2,quiz_option3,quiz_option4}=req.body;
    console.log(req.body);
    try{
        const quiz_id = Date.now().toString().substring(6);
        const quiz=new Quiz({quiz_id,quiz_question,quiz_option1,quiz_option2,quiz_option3,quiz_option4});
        await quiz.save();
        console.log(quiz);
        res.status(201).json(quiz);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error});
    }
});

router.get("/getQuiz", async (req,res)=>{
    try{
        const quizes = await Quiz.find();
        console.log(quizes);
        res.status(200).json(quizes);
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

router.delete("/deleteQuiz/:id", async (req,res) =>{
    try{
        console.log("yaha toh aa raha hoon bhai");
        const {id}=req.params;
        const quiz= await Quiz.findByIdAndDelete(id);
        if(!quiz){
            return res.status(404).json({message: "Quiz not found"});
        }
        res.status(200).json({message: "Quiz deleted successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

router.put("/updateQuiz/:id", async (req,res) =>{
    const {id} =req.params;
    console.log(req.params);
    const {quiz_question , quiz_option1, quiz_option2, quiz_option3 , quiz_option4 }=req.body;
    try{
        const quiz= await Quiz.findById(id);
        if(!quiz){
            return res.status(404).json({message: "Assignment not found"});
        }
        quiz.quiz_question=quiz_question;
        quiz.quiz_option1=quiz_option1;
        quiz.quiz_option2=quiz_option2;
        quiz.quiz_option3=quiz_option3;
        quiz.quiz_option4=quiz_option4;
        const updatedQuiz=await quiz.save();
        res.status(200).json(updatedQuiz);
        console.log("update kardia");
    }catch(error){
        console.log(error);
        return res.status(500).send({message: error});
    }
});

export default router;