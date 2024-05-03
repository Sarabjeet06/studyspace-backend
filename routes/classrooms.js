import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/create_class', async (req , res)=>{
      var user_id = null;
      try{

      }catch(err){
            
            console.log("error in authenticating user" , err);
      }
      try{
            const {name , section , url} = req.body;
      }catch(err){
            console.error(err);
      }
})


export default router;
