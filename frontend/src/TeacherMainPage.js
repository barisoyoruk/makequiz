import React from 'react';
import {trackPromise} from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

class TeacherMainPage extends React.Component {
    
    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const teacher_pk = sessionStorage.getItem('teacher_pk');
        trackPromise (
            axios.get( config.api_url + '/teacher/' + teacher_pk, {
                headers: {Authorization: "Token " + token}
            })
            .then(function(response) {
                sessionStorage.setItem('teacher_email', response.data['user']['email']);
                sessionStorage.setItem('teacher_first_name', response.data['user']['first_name']);
                sessionStorage.setItem('teacher_last_name', response.data['user']['last_name']);
                sessionStorage.setItem('teacher_ID', response.data['teacher_ID']);
                sessionStorage.setItem('teacher_field', response.data['teacher_field']);
                sessionStorage.setItem('teacher_sections', JSON.stringify(response.data['section']));
                sessionStorage.setItem('teacher_quizzes', JSON.stringify(response.data['quiz']));
            })
            .catch(function(error) {
            })
            .then(function() {
            })
        );
    }

    logout() {
        sessionStorage.clear();
    }

    render() {
        return (
            <div id="teacher_main_div">
                <button onClick={()=>this.props.history.push('/TeacherProfilePage')}>My Profile</button>
                <button onClick={()=>this.props.history.push('/TeacherSectionPage')}>Sections</button>
                <button onClick={()=>this.props.history.push('/TeacherQuizPage')}>Quizzes</button>
                <button onClick={()=>this.props.history.push('/TeacherSubmissionPage')}>Submissions</button>
                <button onClick={()=>this.props.history.push('/TeacherResultPage')}>Results</button>
                <br/>
                <br/>
                <br/>
                <button onClick={()=>this.props.history.push('/')}>Logout</button>
            </div>
        )
    }
}

export default TeacherMainPage;