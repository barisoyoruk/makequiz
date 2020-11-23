import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {config} from './config'

function TeacherCreateQuizPage() {
    const history = useHistory();
    const [questionsCreationForm, setQuestionsCreationFrom] = React.useState([]);

    const numberOfQuestionsChanger = e => {
        e.preventDefault();
        let newQuestionsCreationForm = [];
        for (let i = 1; i <= e.target.value; i++) {
            newQuestionsCreationForm.push(
                <div>
                    <br/>
                    <form id={'question:' + i}>
                        <div>
                            <label htmlFor="question_prompt">Question Prompt: </label>
                            <textarea name="question_prompt" id={'question_textarea:' + i}>
                            </textarea>
                        </div>
                        <div>
                            <label htmlFor="question_worth">Question Worth: </label>
                            <input type="number" name="question_worth"/>
                        </div>
                        <div>
                            Question no is: {i}
                        </div>
                        
                    </form>
                    <br/>
                </div>
            )
        }
        setQuestionsCreationFrom(newQuestionsCreationForm);
    }

    const sendQuizCreationForm = e => {
        e.preventDefault();

        if (questionsCreationForm.length === 0)
            return;

        const token = sessionStorage.getItem('token');
        const teacher_pk = sessionStorage.getItem('teacher_pk');
        const quiz_topic = e.target.quiz_topic.value;
        const quiz_field = e.target.quiz_field.value;
        const quiz_no = e.target.quiz_no.value;
        const request_body = {
            'quiz_topic': quiz_topic,
            'quiz_field': quiz_field,
            'quiz_no': quiz_no,
            'teacher': teacher_pk,
        }

        axios.post(config.api_url + '/quiz/create/', request_body, {headers: {Authorization: "Token " + token}})
        .then(function(response) {
            const axios_request_url = config.api_url + '/question/create/';

            let axiost_requests = [];
            for (let i = 1; i <= questionsCreationForm.length; i++) {
                const question_no = i;
                const question_worth = document.getElementById("question:" + i).question_worth.value;
                const question_prompt = document.getElementById("question:" + i).question_prompt.value;
                
                const request_body = {
                    'question_no': question_no,
                    'question_prompt': question_prompt,
                    'question_worth': question_worth,
                    'quiz': response.data.id,
                }
                
                axiost_requests.push(axios.post(axios_request_url, request_body, {headers: {Authorization: "Token " + token}}));
            }
            
            axios.all(axiost_requests)
            .then(axios.spread((...responses) => {
                const teacher_quizzes = JSON.parse(sessionStorage.getItem('teacher_quizzes'));
                teacher_quizzes.push(response.data.id);
                sessionStorage.setItem('teacher_quizzes', JSON.stringify(teacher_quizzes));
                history.push('/TeacherQuizPage');
            }))
            .catch(function(error) {
                
            });
        })
        .catch(function(error) {
        });
    }

    return(
        <div>
            <form onSubmit={(e)=>sendQuizCreationForm(e)}>
                <div>
                    <label htmlFor="quiz_topic">Quiz Topic: </label>
                    <input type="text" name="quiz_topic" placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor="quiz_field">Quiz Field: </label>
                    <input type="text" name="quiz_field" placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor="quiz_no">Quiz No: </label>
                    <input type="number" name="quiz_no" placeholder='*required' required/>
                </div>
                <button type="submit">Create</button>
            </form>
            <input type="number" name="number_of_questions" onChange={(e)=>numberOfQuestionsChanger(e)}/>
            <br/>
            {questionsCreationForm}
        </div>
    );
}

export default TeacherCreateQuizPage;