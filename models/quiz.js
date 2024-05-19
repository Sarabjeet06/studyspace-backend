import mongoose from "mongoose";

const quizSchema= mongoose.Schema({
    quiz_id:{
        type: String,
    },
    quiz_question:{
        type: String,
    },
    quiz_option1:{
        type: String,
    },
    quiz_option2:{
        type: String,
    },
    quiz_option3:{
        type: String,
    },
    quiz_option4:{
        type: String,
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;