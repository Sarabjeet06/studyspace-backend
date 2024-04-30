import mongoose from "mongoose";

export const connectToDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to database");
    } catch (error) {
        console.log(error.message);
    }
}