import express from "express";
import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/sign_up', async (req, res) => {
    console.log("backend me aa gaya bro");
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
            console.log("success");
            return res.status(201).json({ message: "User created successfully" });
        } else {
            const { username, email, password, againPassword } = req.body;
            if (!username || !email || !password || !againPassword) {
                return res.status(400).json({ message: "Enter all the required fields" });
            }
            if (password !== againPassword) {
                return res.status(400).json({ message: "Passwords didn't match" });
            }
            const saltRounds = 10;
            const user_id = Date.now().toString().substring(6);
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                const user = new User({ username, email, password: hash, user_id });
                await user.save();
                console.log(user);
                return res.status(201).json({
                    message: "user successfullly created", user: {
                        _id: user._id
                    }
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

router.post('/login', async (req, res) => {
    console.log("backend me aa gaya bro");
    try {
        if (req.body.google_id) {
            const { email } = req.body;
            const isUserFound = await User.find({email});
            if(!isUserFound){
                return res.status(400).json({message: "You need to sign up first!"});
            }
            return res.status(201).json({message: "login successfull"})
        } else {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Enter all the required fields" });
            }
            const user = await User.findOne({ email: email });
            if (!user) {
                console.log("user nhi hai bhai")
                return res.status(401).json({ message: 'Invalid Email or password' });
            }
            console.log("yaha takk toh theek hai");
            const isPasswordCorrect = bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid Email or password' });
            }
            return res.status(200).json({ message: "login successful", user });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

export default router;