import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

export const getUserIdFromToken = (token) => {
    var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded.userId;
  };

router.post('/sign_up', async (req, res) => {
    try {
        if (req.body.google_id) {
            const { email, username, profile_url } = req.body;
            const isUserFound = await User.findOne({ email });
            if (isUserFound) {
                return res.status(400).json({ message: "User Already exists" });
            }
            const user_id = Date.now().toString().substring(6);
            const user = new User({ username, email, user_id, profile_url });
            await user.save();
            const hashToken = jwt.sign({ userId: user_id }, process.env.JWT_SECRET_KEY);
            return res.status(201).json({ message: "User created successfully", token: hashToken });
        } else {
            const { username, email, password, againPassword } = req.body;
            if (!username || !email || !password || !againPassword) {
                return res.status(400).json({ message: "Enter all the required fields" });
            }
            const isUserFound = await User.findOne({ email });
            if (isUserFound) {
                return res.status(400).json({ message: "User Already exists" });
            }
            if (password !== againPassword) {
                return res.status(400).json({ message: "Passwords didn't match" });
            }
            const saltRounds = 10;
            const user_id = Date.now().toString().substring(6);
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                const user = new User({ username, email, password: hash, user_id });
                await user.save();
                const hashToken = jwt.sign({ userId: user_id }, process.env.JWT_SECRET_KEY);
                return res.status(201).json({
                    message: "user successfullly created", token: hashToken
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.post('/login', async (req, res) => {
    try {
        if (req.body.google_id) {
            const { email } = req.body;
            const isUserFound = await User.find({ email });
            if (!isUserFound) {
                return res.status(400).json({ message: "You need to sign up first!" });
            }
            const hashToken = jwt.sign({ userId: isUserFound[0].user_id }, process.env.JWT_SECRET_KEY);
            return res.status(201).json({ message: "login successfull", data: { hashToken, user: isUserFound } });
        } else {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Enter all the required fields" });
            }
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid Email or password' });
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid Email or password' });
            }
            const hashToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ message: "login successful", data: { hashToken, user: isUserFound } });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

// get user by session
router.post('/get_user' , async (req , res)=>{
    var user_id = null;
    try {
      user_id = getUserIdFromToken(
        req.headers["authorization"].replace("Bearer ", "")
      );
    } catch(err) {
      return res.status(401).json({
        ok: false,
        msg: "Token is malformed or expired",
      });
    }
    try{
        const user = await User.findOne({user_id : user_id});
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        return res.status(200).json({message : "User found", data : user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message : "Internal server error"});
    }
})

export default router;