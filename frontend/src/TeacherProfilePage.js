import React from 'react';
import {useHistory} from 'react-router-dom';

function TeacherProfilePage() {
    const history = useHistory();
    
    const teacher_email = sessionStorage.getItem('teacher_email');
    const teacher_first_name = sessionStorage.getItem('teacher_first_name');
    const teacher_last_name = sessionStorage.getItem('teacher_last_name');
    const teacher_ID = sessionStorage.getItem('teacher_ID');
    const teacher_field = sessionStorage.getItem('teacher_field');

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
                <button onClick={()=>history.push('/TeacherMainPage')}>Main Page</button>
            </div>
        </div>
    )
}

export default TeacherProfilePage;