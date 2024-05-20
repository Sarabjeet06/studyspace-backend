import express from 'express';
import { getUserIdFromToken } from './users.js';
import ClassroomAnnouncement from '../models/classroom_anouncement.js';
import User from '../models/user.js';
const router = express.Router();
router.post('/add_announcement', async (req, res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
  const { classroom_id, description, link_url } = req.body;
  try {
    const already_user = await User.findOne({user_id : user_id});
    if(!already_user){
      return res.status(404).json({ ok: false, msg: "User not found" });
    }
    const newAnnouncement = new ClassroomAnnouncement({
      classroom_id,
      description,
      link_url,
      created_by: already_user._id,
    });
    await newAnnouncement.save();
    res.status(201).json({ok : true , data : newAnnouncement});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

router.get('/announcements/:classroom_id', async (req, res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
  try {
    const announcements = await ClassroomAnnouncement.find({ classroom_id: req.params.classroom_id })
    .populate('created_by', 'username email profile_url'); ;
    res.status(200).json({ok : true , data : announcements});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Read a single announcement by ID
router.get('/announcement/:id', async (req, res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
  try {
    const announcement = await ClassroomAnnouncement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).send({ message: 'Announcement not found' });
    }
    res.status(200).json({ok : true ,data : announcement});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Update an announcement by ID
router.put('/announcement/:id', async (req, res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
  const { description, link_url } = req.body;
  try {
    const updatedAnnouncement = await ClassroomAnnouncement.findByIdAndUpdate(
      req.params.id,
      {  description, link_url },
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).send({ message: 'Announcement not found' });
    }
    res.status(200).json({ok : true , data: updatedAnnouncement});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Delete an announcement by ID
router.delete('/announcement/:id', async (req, res) => {
      var user_id = null;
      try {
         user_id = getUserIdFromToken(req.headers["authorization"].replace("Bearer ", ""));
      } catch (err) {
         return res.status(401).json({
            ok: false,
            msg: "Token is malformed or expired",
         });
      }
  try {
    const deletedAnnouncement = await ClassroomAnnouncement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).send({ message: 'Announcement not found' });
    }
    res.status(200).send({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

export default router;
