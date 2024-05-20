import express from 'express';
import { getUserIdFromToken } from './users.js';
import AssignmentSubmission from '../models/submission.js';
import { upload } from '../middlewares/multer.middleware.js';
import User from '../models/user.js';
import Classroom from '../models/classroom.js';
import Assignment from '../models/assignment.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { delete_files_from_upload } from '../utils/clearUploadFolder.js';

const router = express.Router();

// Create a new assignment submission
router.post('/submissions',upload.single('file'),   async (req, res) => {
  let user_id = null;
  try {
    user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "Token is malformed or expired",
    });
  }

  const {  assignment_id , classroom_id } = req.body;
  var file = req.file;
  var uploaded_file_url;
  if(file) uploaded_file_url = await uploadOnCloudinary(file?.path);
  const submission_id = Date.now().toString().substring(6);
  const already_user = await User.findOne({user_id : user_id});
  if(!already_user){
      return res.status(404).json({ message: "User not found" });
  }

  const classroom = await Classroom.findOne({ classroom_id: classroom_id });
  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found" });
  }

  const assignment = await Assignment.findOne({ assignment_id: assignment_id });
  if(!assignment){
      return res.status(404).json({ message: "Assignment not found" });
  }

  var newclass = {
      submission_id : submission_id,
      user_id : already_user._id,
      assignment_id : assignment._id,
      point_given: 0,
  };
  if (uploaded_file_url !== null) {
      newclass.url = uploaded_file_url?.url;
   }
  const newSubmission = new AssignmentSubmission(newclass);
  try {
    const savedSubmission = await newSubmission.save();
    res.status(201).json({ ok: true, data: savedSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }finally{
      delete_files_from_upload();
  }
});

// Get all submissions for a specific assignment
router.get('/submissions/assignment/:assignment_id', async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignment_id: req.params.assignment_id })
      .populate('user_id', 'username email profile_url')
      .populate('assignment_id', 'heading description');
    res.status(200).json({ ok: true, data: submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific submission by ID
router.get('/submissions/:submission_id', async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findOne({ submission_id: req.params.submission_id })
      .populate('user_id', 'username email')
      .populate('assignment_id', 'heading description');
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json({ ok: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a specific submission by ID
router.put('/submissions/:submission_id', async (req, res) => {
  const { url, point_given } = req.body;
  try {
    const updatedSubmission = await AssignmentSubmission.findOneAndUpdate(
      { submission_id: req.params.submission_id },
      { url, point_given },
      { new: true }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json({ ok: true, data: updatedSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific submission by ID
router.delete('/submissions/:submission_id', async (req, res) => {
  try {
    const deletedSubmission = await AssignmentSubmission.findOneAndDelete({ submission_id: req.params.submission_id });
    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json({ ok: true, message: "Submission deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/submissions/classroom/:classroom_id', async (req, res) => {
      let user_id = null;
      try {
        user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
        return res.status(401).json({
          ok: false,
          msg: "Token is malformed or expired",
        });
      }
    
      try {
        const { classroom_id } = req.params;
        const classroom = await Classroom.findOne({ classroom_id });
        if (!classroom) {
          return res.status(404).json({ message: "Classroom not found" });
        }
    
        const assignments = await Assignment.find({ classroom_id: classroom.classroom_id });
    
        const allSubmissions = await Promise.all(assignments.map(async (assignment) => {
          const submissions = await AssignmentSubmission.find({ assignment_id: assignment._id })
            .populate('user_id', 'username email profile_url')
            .populate('assignment_id', 'heading description');
          return {
            assignment_id: assignment._id,
            assignment_heading: assignment.heading,
            submissions: submissions,
          };
        }));
    
        res.status(200).json({ ok: true, data: allSubmissions });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    });
    

export default router;
