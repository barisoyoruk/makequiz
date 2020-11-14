import React from 'react';
import {useHistory} from 'react-router-dom';
import {trackPromise} from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

function StudentProfilePage() {
    const history = useHistory();
    const token = sessionStorage.getItem('user_token');
    
    const [student_email, set_student_email] = React.useState();
    const [student_first_name, set_student_first_name] = React.useState();
    const [student_last_name, set_student_last_name] = React.useState();
    const [student_ID, set_student_ID] = React.useState();
    const [student_class, set_student_class] = React.useState();

    trackPromise (
        axios.get( config.api_url + '/student/', {
            headers: {Authorization: "Token " + token}
          })
        .then(function(response) {
            set_student_email(response.data['user']['email']);
            set_student_first_name(response.data['user']['first_name']);
            set_student_last_name(response.data['user']['last_name']);
            set_student_ID(response.data['student_ID']);
            set_student_class(response.data['student_class'])
        })
        .catch(function(error) {
        })
        .then(function() {
        })
    );

    return (
        <div id="student_profile_div">
            <div id="student_user_information">
                <table id="student_user_table">
                    <thead>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Student ID</th>
                        <th>Student Class</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{student_email}</td>
                            <td>{student_first_name}</td>
                            <td>{student_last_name}</td>
                            <td>{student_ID}</td>
                            <td>{student_class}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentProfilePage;