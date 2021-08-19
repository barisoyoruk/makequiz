import React from 'react';
import axios from 'axios';
import {config} from './config'

class TeacherSubmissionPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            teacher_submissions_data: [],
        }
    }

    componentDidMount() {
        
        const token = sessionStorage.getItem('token');
        const quizzes_pk = JSON.parse(sessionStorage.getItem('teacher_quizzes'));

        let axios_submission_request_urls = [];
        for (let quiz_pk of quizzes_pk) {
            axios_submission_request_urls.push(config.api_url + '/quiz/' + quiz_pk);
        }

        let axios_submission_requests = [];
        for (let axios_submission_request_url of axios_submission_request_urls) {
            axios_submission_requests.push(axios.get(axios_submission_request_url, {headers: {Authorization: "Token " + token}}));
        }

        let teacher_submissions = []; 
        axios.all(axios_submission_requests)
        .then(axios.spread((...quizzes_responses) => {
            for(let quiz_response of quizzes_responses) {
                let a = quiz_response.data['submission']
                for (let items of a) {
                  teacher_submissions.push(items);
                }
            }

            const self = this;
            for (let submission_pk of teacher_submissions) {
                axios.get(config.api_url + '/submission/' + submission_pk, {
                            headers: {Authorization: 'Token ' + token}
                })
                .then(function(response) {
                    const quiz_pk = response.data['quiz'];
                    const answers_pk = response.data['answer'];
                    const student_pk = response.data['student'];
                    const submission_date = response.data['submission_date']

                    axios.get(config.api_url + '/student/' + student_pk, {
                            headers: {Authorization: 'Token ' + token}
                    })
                    .then(function(student_response) {
                        const student_data = {
                            'student_first_name': student_response.data['user']['first_name'],
                            'student_last_name': student_response.data['user']['last_name'],
                            'student_ID': student_response.data['student_ID'],
                            'student_class': student_response.data['student_class'],
                            'student_email': student_response.data['user']['email'],
                        }

                        axios.get(config.api_url + '/quiz/' + quiz_pk, {
                            headers: {Authorization: 'Token ' + token}
                        })
                        .then(function(quiz_response) {
                            const quiz_topic = quiz_response.data['quiz_topic'];
                            const quiz_field = quiz_response.data['quiz_field']; 
                            const quiz_no = quiz_response.data['quiz_no'];

                            let axios_request_urls = [];
                            for (let answer_pk of answers_pk) {
                                axios_request_urls.push(config.api_url + '/answer/' + answer_pk);
                            }
                            
                            let axios_requests = [];
                            for (let axios_request_url of axios_request_urls) {
                                axios_requests.push(axios.get(axios_request_url, {headers: {Authorization: "Token " + token}}));
                            }

                            let answers_data = [];
                            axios.all(axios_requests)
                            .then(axios.spread((...responses) => {

                                let axios_questions_request_urls = [];
                                for (let answer_response of responses) {
                                    axios_questions_request_urls.push(config.api_url + '/question/' + answer_response.data['question']);
                                }
            
                                let axios_question_requests = [];
                                for (let axios_question_request_url of axios_questions_request_urls) {
                                    axios_question_requests.push(axios.get(axios_question_request_url, {headers: {Authorization: "Token " + token}}));
                                }

                                axios.all(axios_question_requests)
                                .then(axios.spread((...question_responses) => {
                                    


                                    for(let index in question_responses) {
                                        answers_data.push({
                                            'answer_text': responses[index].data['answer_text'],
                                            'question_prompt': question_responses[index].data['question_prompt'],
                                            'question_worth': question_responses[index].data['question_worth'],
                                            'question_no': question_responses[index].data['question_no'],
                                        })
                                    }
                                    self.setState({
                                        teacher_submissions_data: [...self.state.teacher_submissions_data, {
                                            'questions_answers': answers_data,
                                            'student_data': student_data,
                                            'quiz_topic': quiz_topic,
                                            'quiz_field': quiz_field,
                                            'quiz_no': quiz_no,
                                            'submission_date': submission_date,
                                        }]
                                    })
                                    
                                }))
                            }))
                        })
                    })

                    
                })
            }
        }))
        
    }
    
    render() {
        let copy_teacher_submissions_data = this.state.teacher_submissions_data;
        copy_teacher_submissions_data.sort(function(a,b) {
            return a.submission_date - b.submission_date;
        })

        let submissions_list = copy_teacher_submissions_data.map((data) => 
            <div>
                <QuizHeaderComponent quiz_no={data.quiz_no} quiz_field={data.quiz_field}
                    quiz_topic={data.quiz_topic} submission_date={data.submission_date}/>
                <QuestionComponent questions_answers={data.questions_answers}/>
                <StudentComponent student_data={data.student_data}/>
                <FeedbackComponent />
            </div>
        )

        return(
            <div>
                <button onClick={()=>this.props.history.push('/TeacherMainPage')}>Main Page</button>
                <br/>
                <br/>
                {submissions_list}
            </div>
        )
    }
}

function QuizHeaderComponent(props) {
    return(
        <div>
            <div>Quiz No: {props.quiz_no}</div>
            <div>Quiz Field: {props.quiz_field}</div>
            <div>Quiz Topic: {props.quiz_topic}</div>
            <div>Submission Date: {props.submission_date}</div>
            <br/>
        </div>
    )
}

function QuestionComponent(props) {
    let copy_questions_answers = props.questions_answers;
    copy_questions_answers.sort(function(a,b) {
        return a.question_no - b.question_no;
    });

    let questionsListItem = copy_questions_answers.map((data) => 
        <div>
            <div>{data.question_no}- {data.question_prompt}</div>
            <div>Question Worth: {data.question_worth}</div>
            <div>Answer: {data.answer_text}</div>
            <br/>
        </div>
    );

    return(
        <div>
            {questionsListItem}
        </div>
    )
}

function StudentComponent(props) {
    return(
        <div>
            <div>Student Name: {props.student_data.student_first_name} {props.student_data.student_last_name}</div>
            <div>Student ID: {props.student_data.student_ID}</div>
            <div>Student Class: {props.student_data.student_class}</div>
            <div>Student Email: {props.student_data.student_email}</div>
        <br/>
    </div>
    )
}

function FeedbackComponent(props) {
    return(
        <div>
            <form onSubmit="gradeSubmission">
                <label htmlFor="grade">Grade: </label>
                <input type="number" name="grade"/>
                <label htmlFor="feedback">Feedback: </label>
                <textarea name="feedback" id="" cols="30" rows="10"></textarea>
                <div>
                    <br/>
                   <input type="submit" value="Puanla"/>
                </div>
            </form>
            <hr/>
        </div>
    )
}

export default TeacherSubmissionPage;