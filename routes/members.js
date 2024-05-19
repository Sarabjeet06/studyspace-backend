/** @format */

import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Classroom from "../models/classroom.js";
import { getUserIdFromToken } from "./users.js";
import classUser from "../models/class_user.js";

const router = express.Router();

router.post("/get_members_by_id", async (req, res) => {
   var user_id = null;
   try {
      user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
   } catch (err) {
      return res.status(401).json({
         ok: false,
         msg: "Token is malformed or expired",
      });
   }
   try {
      const { classroom_id } = req.body;
      const classroom = await Classroom.findOne({ classroom_id: classroom_id });
      if (!classroom) {
         return res.status(404).json({ message: "Classroom not found" });
      }
      const members = await classUser.find({ classroom_id: classroom._id }).populate({
         path: "member_id",
         select: "username email user_id profile_url",
      });

      // Return the members
      return res.status(200).json({
         ok: true,
         data: members,
      });
   } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
   }
});


router.get('/member_role' , async (req , res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
      try {
            const { user_id  , classroom_id } = req.query;
            const classroom = await Classroom.findOne({ classroom_id: classroom_id });
            if (!classroom) {
               return res.status(404).json({ message: "Classroom not found" });
            }
            const already_user = await User.findOne({user_id : user_id});
            if(!already_user){
                  return res.status(404).json({ ok: false, msg: "User not found" });
            }
            const members = await classUser.find({ classroom_id: classroom._id  , member_id :  already_user._id});


            if(members?.length === 0){
                  return res.status(200).json({ok : true , role : "teacher"});
            }
            return res.status(200).json({
               ok: true,
               role : "member",
            });
         } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
         }
})
export default router;
