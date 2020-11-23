import React from 'react';
import {useHistory} from 'react-router-dom';

function StudentProfilePage() {
    const history = useHistory();

    const student_email = sessionStorage.getItem('student_email');
    const student_first_name = sessionStorage.getItem('student_first_name');
    const student_last_name = sessionStorage.getItem('student_last_name');
    const student_ID = sessionStorage.getItem('student_ID');
    const student_class = sessionStorage.getItem('student_class');

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
                <button onClick={()=>history.push('/StudentMainPage')}>Main Page</button>
            </div>
        </div>
    );
}

export default StudentProfilePage;