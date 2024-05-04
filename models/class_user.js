import mongoose from "mongoose";

const classUserSchema = mongoose.Schema({
   classroom_user_id: {
      type: String,
      required: true,
   },
   classroom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
   },
   member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   created_on: {
      type: Date,
      default: Date.now(),
   },
});

const classUser = mongoose.model("classUser", classUserSchema);

export default classUser;
