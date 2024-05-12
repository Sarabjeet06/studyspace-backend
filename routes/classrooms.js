/** @format */

import express from "express";
import User from "../models/user.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Classroom from "../models/classroom.js";
import nodemailer from "nodemailer";
import { sendInviteMail } from "../utils/emailtemplates/invite.js";
import classUser from "../models/class_user.js";
import { delete_files_from_upload } from "../utils/clearUploadFolder.js";
import { read_csv_file } from "../utils/readCsvData.js";
const router = express.Router();

export const sendInvitationEmail = async (email , classroom_id  , classroom_name , new_user = true) => {
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
           subject: "Invitation to join space",
           html: sendInviteMail(
               classroom_id,
               process.env.FRONTEND_URL,
               new_user,
               classroom_name
           ),
       };

       await transporter.sendMail(mailOptions);
       console.log(`Invitation email sent to ${email}`);
   } catch (error) {
       console.error(`Error sending invitation email to ${email}: ${error}`);
   }
};

router.post("/create_class", upload.single("file"), async (req, res) => {
   var user_id = null;
   try {
   } catch (err) {
      console.log("error in authenticating user", err);
   }
   try {
      const { name, section } = req.body;
      // temporarily for new instead of jwt
      user_id = req.body.user_id;
      var file = req.file;
      const already_user = await User.findOne({ user_id: user_id });
      if (!already_user) {
         return res.status(404).json({ ok: false, msg: "User not found" });
      }
      const uploaded_file_url = await uploadOnCloudinary(file.path);
      var new_class = {
         classroom_id: Date.now().toString().substring(6),
         classroom_name: name,
         classroom_section: section,
         created_by: already_user._id,
      };
      if (uploaded_file_url !== null) {
         new_class.classroom_background_url = uploaded_file_url?.url;
      }
      const new_classroom = await new Classroom(new_class);
      await new_classroom.save();
      return res.status(200).json({ ok: true, msg: "space created successfully" });
   } catch (err) {
      console.error(err);
   }
   //     finally {
   //       await delete_files_from_upload();
   //    }
});

router.post("/email_invite", upload.single("file"), async (req, res) => {
   var user_id = null;
   try {
   } catch (err) {
      console.log("error in authenticating user", err);
   }
   try {
      const { email, classroom_id } = req.body;
      var file = null;
      if (req.file) {
         file = req.file;
      }

      if (file) {
         const file_data = await read_csv_file(file.path);
         if(file_data === null){
            return res.status(404).json({ ok: false, msg: "File not found" });
         }
         const classroom = await Classroom.findOne({ classroom_id: classroom_id });
         if (!classroom) {
            return res.status(404).json({ ok: false, msg: "Classroom not found" });
         }
         await Promise.all(file_data.map(user => sendInvitationEmail(user?.email  , classroom_id , classroom?.classroom_name , user?.new_user)));
      } else {
         var new_user = false;
         const user = await User.findOne({ email: email });
         if (!user) {
            new_user = true;
         }
         const classroom = await Classroom.findOne({ classroom_id: classroom_id });
         if (!classroom) {
            return res.status(404).json({ ok: false, msg: "Classroom not found" });
         }

         const transporter = nodemailer.createTransport({
            // Configure the transporter with your email service provider details
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
            subject: "Invitation to join space",
            html: sendInviteMail(
               classroom_id,
               process.env.FRONTEND_URL,
               new_user,
               classroom?.classroom_name
            ),
         };

         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               console.error(error);
               return res.status(500).json({ ok: false, msg: "Failed to send reset email" });
            }
         });
      }
      return res.status(200).json({ ok: true, msg: "Email sent successfully" });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, msg: "Internal server error" });
   } finally {
      await delete_files_from_upload();
   }
});

router.post("/join_class", async (req, res) => {
   var user_id = null;
   try {
   } catch (err) {
      console.log("error in authenticating user", err);
   }
   try {
      const { classroom_id, email } = req.body;
      const classroom = await Classroom.findOne({
         classroom_id: classroom_id,
      });
      if (!classroom) {
         return res.status(404).json({ ok: false, msg: "Classroom not found" });
      }
      const user = await User.findOne({
         email: email,
      });
      if (!user) {
         return res.status(404).json({ ok: false, msg: "User not found" });
      }
      const class_member = await classUser.findOne({ member_id: user._id });
      if (class_member) {
         return res.status(404).json({ ok: false, msg: "User already a member" });
      }
      const new_memeber = {
         classroom_user_id: Date.now().toString().substring(6),
         member_id: user._id,
         classroom_id: classroom._id,
      };
      const new_classroom_member = await classUser(new_memeber);
      await new_classroom_member.save();
      return res.status(200).json({ ok: true, msg: "Classroom joined successfully" });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, msg: "Internal server error" });
   }
});

router.post("/get_classroom_by_id", async function (req, res) {
   var user_id = null;
   try {
   } catch (err) {
      console.log("error in authenticating user", err);
   }
   try {
      user_id = req.body.user_id;
      const user = await User.findOne({ user_id: user_id });
      if (!user) {
         return res.status(404).json({ ok: false, msg: "User not found" });
      }
      const classrooms = await Classroom.find({ created_by: user._id }).populate({
         path : "created_by",
         select : `username email user_id profile_url`
      }).exec();
      const joined_classrooms = await classUser.find({member_id : user._id}).populate({
         path : "classroom_id",
         select : `classroom_id classroom_name classroom_section classroom_background_url created_by`,
         populate : {
            path : "created_by",
            select : `username email user_id profile_url`
         }
      });
      return res.status(200).json({ ok: true, data: {
         classrooms: classrooms,
         joined_classrooms: joined_classrooms,
      } });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, msg: "Internal server error" });
   }
});

export default router;
