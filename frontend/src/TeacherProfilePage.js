import React from 'react';
import {useHistory} from 'react-router-dom';
import {trackPromise} from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

function TeacherProfilePage() {
    const history = useHistory();
    const token = sessionStorage.getItem('user_token');
    
    const [teacher_email, set_teacher_email] = React.useState();
    const [teacher_first_name, set_teacher_first_name] = React.useState();
    const [teacher_last_name, set_teacher_last_name] = React.useState();
    const [teacher_ID, set_teacher_ID] = React.useState();
    const [teacher_field, set_teacher_field] = React.useState();

    trackPromise (
        axios.get( config.api_url + '/teacher/', {
            headers: {Authorization: "Token " + token}
          })
        .then(function(response) {
            set_teacher_email(response.data['user']['email']);
            set_teacher_first_name(response.data['user']['first_name']);
            set_teacher_last_name(response.data['user']['last_name']);
            set_teacher_ID(response.data['teacher_ID']);
            set_teacher_field(response.data['teacher_field'])
        })
        .catch(function(error) {
        })
        .then(function() {
        })
    );

    return (
        <div id="teacher_profile_div">
            <div id="teacher_user_information">
                <table id="teacher_user_table">
                    <thead>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Teacher ID</th>
                        <th>Teacher Field</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{teacher_email}</td>
                            <td>{teacher_first_name}</td>
                            <td>{teacher_last_name}</td>
                            <td>{teacher_ID}</td>
                            <td>{teacher_field}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeacherProfilePage;