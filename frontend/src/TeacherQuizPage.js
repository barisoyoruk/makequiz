import React from 'react';
import axios from 'axios';
import {config} from './config'

class TeacherQuizPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher_quizzes_data: [],
        }
        this.assignQuizToNewSection = this.assignQuizToNewSection.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const teacher_quizzes = JSON.parse(sessionStorage.getItem('teacher_quizzes'));
        const self = this;
        for (let quiz_pk of teacher_quizzes) {
            axios.get(config.api_url + '/quiz/' + quiz_pk, {
                        headers: {Authorization: "Token " + token}
            })
            .then(function(response) {
                if(response.data['questions'].length === 0) {
                    self.setState({
                        teacher_quizzes_data: [...self.state.teacher_quizzes_data, {
                            'quiz_topic': response.data['quiz_topic'],
                            'quiz_field': response.data['quiz_field'],
                            'quiz_no': response.data['quiz_no'],
                            'quiz_pk': quiz_pk,
                            'questions_data': [],
                        }]
                    });
              }
              else {
                const questions_pk = response.data['questions'];
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
                        })
                    }

                    const teacher_sections = JSON.parse(sessionStorage.getItem('teacher_sections'));
                    let axios_request_urls = [];
                    for (let section_pk of teacher_sections) {
                        axios_request_urls.push(config.api_url + '/section/' + section_pk);
                    }

                    let axios_requests = [];
                    for (let axios_request_url of axios_request_urls) {
                        axios_requests.push(axios.get(axios_request_url, {headers: {Authorization: "Token " + token}}));
                    }
                    
                    let sections_data = [];
                    axios.all(axios_requests)
                    .then(axios.spread((...responses) => {
                        for (let section_response of responses) {
                            sections_data.push({
                                'section_code':  section_response.data['section_code'],
                                'section': section_response.data['section_pk'],
                            })
                        }
                        self.setState({
                            teacher_quizzes_data: [...self.state.teacher_quizzes_data, {
                                'quiz_topic': response.data['quiz_topic'],
                                'quiz_field': response.data['quiz_field'],
                                'quiz_no': response.data['quiz_no'],
                                'quiz_pk': quiz_pk,
                                'questions_data': questions_data,
                                'sections_data': sections_data
                            }]
                        });
                    }));
                }));
              }
            });
        }
    }

    assignQuizToNewSection(e, quiz_pk) {
        e.preventDefault();

        const today = new Date();
        const publication_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        const publication_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const due_date = e.target.due_date.value;
        const due_time = e.target.due_time.value;

        const token = sessionStorage.getItem('token');
        const section_pk = e.target.teacher_section.value;
        const request_body = {
            'section': section_pk,
            'quiz': quiz_pk,
            'publication_date': publication_date + "T" + publication_time,
            'due_date': due_date + "T" + due_time,
        }

        axios.post(config.api_url + '/assignment/createWithSection/', request_body, {
                    headers: {Authorization: "Token " + token}
        })
        .then(function(response) {
        })
    }

    render() {
        let copy_teacher_quizzes_data = this.state.teacher_quizzes_data;
        copy_teacher_quizzes_data.sort(function(a,b) {
            return b.quiz_no - a.quiz_no;
        });

        let quizzesListItem = copy_teacher_quizzes_data.map((data) =>
            <div>
                <QuizHeaderComponent quiz_no={data.quiz_no} quiz_field={data.quiz_field} quiz_pk={data.quiz_pk}
                                    quiz_topic={data.quiz_topic} assignQuizToNewSection={this.assignQuizToNewSection}
                                    sections_data={data.sections_data}/>
                <QuestionComponent questions_data={data.questions_data}/>
            </div>
        )

        return(
            <div>
                <button onClick={()=>this.props.history.push('/TeacherMainPage')}>Main Page</button>
                <br/>
                <br/>
                <button onClick={()=>this.props.history.push('/TeacherCreateQuizPage')}>Create New Quiz</button>
                <br/>
                <br/>
                {quizzesListItem}
            </div>
        )
    }
}

function QuizHeaderComponent(props) {
    let copy_teacher_sections_data = props.sections_data
    copy_teacher_sections_data.sort(function(a,b) {
        return b.section_code - a.section_code;
    });

    
    let sectionsCodesListItem = copy_teacher_sections_data.map((data)=> 
        <option>{data.section_code}</option>
    );

    return(
        <div>
            <hr/>
            <div>Quiz No: {props.quiz_no}</div>
            <div>Quiz Field: {props.quiz_field}</div>
            <div>Quiz Topic: {props.quiz_topic}</div>
            <form onSubmit={(e)=>props.assignQuizToNewSection(e, props.quiz_pk)}>
                <label htmlFor="teacher_section">Section Code: </label>
                <input list="teacher_sections" name="teacher_section"/>
                <datalist id="teacher_sections">
                    {sectionsCodesListItem}
                </datalist>
                <label htmlFor="due_date"> Due Date: </label>
                <input type="date" name="due_date"/>
                <label htmlFor="due_date"> Due Time: </label>
                <input type="time" name="due_time"/>
                <button >Assign to New Section</button>
            </form>
            <br/>
            <br/>
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
            <div>{data.question_no}- {data.question_prompt}</div>
            <div>Question Worth: {data.question_worth}</div>
            <br/>
        </div>
    );

    return(
        <div>
            {questionsListItem}
        </div>
    )
}

export default TeacherQuizPage;