import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema({
   classroom_id: {
      type: String,
      required: true,
   },
   assignment_id: {
      type: String,
      required: true,
      unique: true,
   },
   question_url: {
      type: String,
      required: true,
   },
   heading: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   created_on: {
      type: Date,
      default: Date.now(),
   },
   deadline: {
      type: Date,
      required: true,
   },
   total_points: {
      type: Number,
      required: true,
   },
   status: {
      type: String,
      enum: ["complete", "ongoing"],
      default: "ongoing",
   },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
