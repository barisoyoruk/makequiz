import React from 'react';
import axios from 'axios';
import {config} from './config'

class StudentAttemptAssignmentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'questions_data': []
        }
    }

    componentDidMount() {
        const assignment_pk = this.props.match.params.id.substring(1);
        const token = sessionStorage.getItem('token');

        const self = this;
        axios.get(config.api_url + '/assignment/' + assignment_pk, {
                    headers: {Authorization: "Token " + token}
        })
        .then(function(assignment_response) {
            const quiz_pk = assignment_response.data['quiz'];
            const student_pk = assignment_response.data['student'];
            const publication_date = assignment_response.data['publication_date'];
            const due_date = assignment_response.data['due_date'];

            axios.get(config.api_url + '/quiz/' + quiz_pk, {
                        headers: {Authorization: 'Token ' + token}
            })
            .then(function(quiz_response) {
                const quiz_topic = quiz_response.data.quiz_topic;
                const quiz_field = quiz_response.data.quiz_field;
                const quiz_no = quiz_response.data.quiz_no;

                const questions_pk = quiz_response.data['questions'];
                let axios_request_urls = [];
                for (let question_pk of questions_pk) {
                    axios_request_urls.push(config.api_url + '/question/' + question_pk);
                }

                let axios_requests = [];
                for (let axios_request_url of axios_request_urls) {
                    axios_requests.push(axios.get(axios_request_url, {headers: {Authorization: "Token " + token}}));
                }
                
                let questions_data = [];
                axios.all(axios_requests)
                .then(axios.spread((...responses) => {
                    for (let question_response of responses) {
                        questions_data.push({
                            'question_prompt':  question_response.data['question_prompt'],
                            'question_worth': question_response.data['question_worth'],
                            'question_no': question_response.data['question_no'],
                            'question_pk': question_response.data['id']
                        })
                    }

                    self.setState({
                        'quiz_topic': quiz_topic,
                        'quiz_field': quiz_field,
                        'quiz_no': quiz_no,
                        'questions_data': questions_data,
                        'publication_date': publication_date,
                        'due_date': due_date,
                        'student_pk': student_pk,
                        'assignment_pk': assignment_pk,
                        'quiz_pk': quiz_pk,
                    });
                }));
            })
        });
    }

    submitAnswers() {
        const token = sessionStorage.getItem('token');
        const quiz_pk = this.state.quiz_pk;

        const today = new Date();
        const publication_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        const publication_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        
        const self = this
        axios.post(config.api_url + '/submission/create/', {'quiz': quiz_pk, 'submission_date': publication_date + "T" + publication_time}, {
                    headers: {Authorization: 'Token ' + token}
        })
        .then(function(response) {
            const submission_pk = response.data['pk']

            for (let question_data of self.state.questions_data) {
                let answer = document.getElementById("answer" + question_data.question_pk).value;
                axios.post(config.api_url + '/answer/create/', {'answer_text': answer, 
                                                                'question': question_data.question_pk,
                                                                'submission': submission_pk}, {
                                                                headers: {Authorization: "Token " + token}
                }) 
            }

            axios.delete(config.api_url + '/assignment/' + self.state.assignment_pk, {
                    headers: {Authorization: 'Token ' + token}
            })
            
            self.props.history.push('/StudentAssignmentPage');
        })
    }

    render() {
        

        return(
            <div>
                <button onClick={()=>this.props.history.push('/StudentMainPage')}>Main Page</button>
                <br/>
                <br/>
                <QuizHeaderComponent quiz_no={this.state.quiz_no} quiz_field={this.state.quiz_field} 
                quiz_topic={this.state.quiz_topic} publication_date={this.state.publication_date} due_date={this.state.due_date}/>
                <br/>
                <br/>
                <QuestionComponent questions_data={this.state.questions_data}/>
                <br/>
                <hr/>
                <br/>
                <button onClick={()=>this.submitAnswers()}>Submit</button>
            </div>
        );
    }
}

function QuizHeaderComponent(props) {
    return(
        <div>
            <div>Quiz No: {props.quiz_no}</div>
            <div>Quiz Field: {props.quiz_field}</div>
            <div>Quiz Topic: {props.quiz_topic}</div>
            <div>Publication Date: {props.publication_date}</div>
            <div>Due Data: {props.due_date}</div>
        </div>
    )
}

function QuestionComponent(props) {
    let copy_questions_data = props.questions_data;
    copy_questions_data.sort(function(a,b) {
        return a.question_no - b.question_no;
    });

    let questionsListItem = copy_questions_data.map((data) => 
        <div>
            <br/>
            <hr/>
            <br/>
            <div>{data.question_no} - {data.question_prompt}</div>
            <div>Question Worth: {data.question_worth}</div>
            <textarea id={"answer" + data.question_pk}></textarea>
            <br/>
            <br/>
        </div>
    );

    return(
        <div>
            {questionsListItem}
        </div>
    )
}

export default StudentAttemptAssignmentPage