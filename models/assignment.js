import mongoose from "mongoose";

const assignmentSchema= mongoose.Schema({
    assignment_id:{
        type: String,
    },
    assignment_name:{
        type: String,
    },
    assignment_date:{
        type: Date,
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;