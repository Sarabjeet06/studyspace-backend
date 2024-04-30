import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    user_id:{
        type: String,
        required: true,
    },
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
    },
    profile_url: {
        type: String,
    }
});

const User = mongoose.model('User', userSchema);

export default User;