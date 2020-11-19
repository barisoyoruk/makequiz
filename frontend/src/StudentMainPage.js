import React from 'react';
import {trackPromise} from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

class StudentMainPage extends React.Component {
    
    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const student_pk = sessionStorage.getItem('student_pk')
        trackPromise (
            axios.get( config.api_url + '/student/' + student_pk, {
                headers: {Authorization: "Token " + token}
              })
            .then(function(response) {
                sessionStorage.setItem('student_email', response.data['user']['email']);
                sessionStorage.setItem('student_first_name', response.data['user']['first_name']);
                sessionStorage.setItem('student_last_name', response.data['user']['last_name']);
                sessionStorage.setItem('student_ID', response.data['student_ID']);
                sessionStorage.setItem('student_class', response.data['student_class']);
                sessionStorage.setItem('student_pk', response.data['pk']);
            })
            .catch(function(error) {
            })
            .then(function() {
            })
        );
    }

    render() {
        return (
            <div id="student_main_div">
                <button onClick={()=>this.props.history.push('/StudentProfilePage')}>My Profile</button>
                <button onClick={()=>this.props.history.push('/StudentSectionsPage')}>Sections</button>
                <button onClick={()=>this.props.history.push('/StudentQuizzesPage')}>Quizzes</button>
                <button onClick={()=>this.props.history.push('/StudentSubmissionsPage')}>Submissions</button>
                <button onClick={()=>this.props.history.push('/StudentResultsPage')}>Results</button>
            </div>
        )
    }
}

export default StudentMainPage;