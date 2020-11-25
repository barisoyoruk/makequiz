import React from 'react';
import axios from 'axios';
import {config} from './config'

class StudentSubmissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_submissions_data: [],
        }
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const student_submissions = JSON.parse(sessionStorage.getItem('student_submissions'));
        const self = this;
        for (let submission_pk of student_submissions) {
            axios.get(config.api_url + '/submission/' + submission_pk, {
                        headers: {Authorization: 'Token ' + token}
            })
            .then(function(response) {
                const quiz_pk = response.data['quiz'];
                const answers_pk = response.data['answer'];
                const submission_date = response.data['submission_date']

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
                                student_submissions_data: [...self.state.student_submissions_data, {
                                    'questions_answers': answers_data,
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
        }
    }

    render() {
        let copy_student_submissions_data = this.state.student_submissions_data;
        copy_student_submissions_data.sort(function(a,b) {
            return a.submission_date - b.submission_date;
        })

        let submissions_list = copy_student_submissions_data.map((data) => 
            <div>
                <QuizHeaderComponent quiz_no={data.quiz_no} quiz_field={data.quiz_field}
                    quiz_topic={data.quiz_topic} submission_date={data.submission_date}/>
                <QuestionComponent questions_answers={data.questions_answers}/>
            </div>
        )

        return(
            <div>
                <button onClick={()=>this.props.history.push('/StudentMainPage')}>Main Page</button>
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
            <br/>
            <div>{data.question_no}- {data.question_prompt}</div>
            <div>Question Worth: {data.question_worth}</div>
            <div>Answer: {data.answer_text}</div>
            <br/>
            <hr/>
        </div>
    );

    return(
        <div>
            {questionsListItem}
        </div>
    )
}

export default StudentSubmissionPage