import mongoose from 'mongoose';

const classroomAnnouncementSchema = mongoose.Schema({
  classroom_id: {
    type: String,
    ref: "Classroom",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link_url: {
    type: String,
  },
  created_by : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const ClassroomAnnouncement = mongoose.model('ClassroomAnnouncement', classroomAnnouncementSchema);

export default ClassroomAnnouncement;
