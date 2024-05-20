import mongoose from 'mongoose';

const assignmentSubmissionSchema = mongoose.Schema({
  submission_id: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  point_given: {
    type: Number,
    default: 0,
  },
});

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

export default AssignmentSubmission;
