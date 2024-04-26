import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 30,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password:{
        type: String,
        required: true,
        min: 6,
    },
    profile_url: {
        type: string,
    }
});

const User = mongoose.model('User', userSchema);

export default User;