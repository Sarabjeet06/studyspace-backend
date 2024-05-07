import mongoose from "mongoose";

const classroomSchema = mongoose.Schema({
   classroom_id: {
      type: String,
      required: true,
   },
   classroom_name: {
      type: String,
      required: true,
   },
   classroom_section: {
      type: String,
      required: true,
   },
   classroom_background_url: {
      type: String,
      default:
         "https://res.cloudinary.com/dqpirrbuh/image/upload/v1714684229/zy4i_hjsz_210617_qqbclc.jpg",
   },
   created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   archived : {
      type : Boolean,
      default  : false, 
   },
   created_on: {
      type: Date,
      default: Date.now(),
   },
});

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;
