import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

function TeacherProfilePage() {
    const history = useHistory();
    
    const [teacher_email, set_teacher_email] = React.useState("");
    const [teacher_first_name, set_teacher_first_name] = React.useState("");
    const [teacher_last_name, set_teacher_last_name] = React.useState("");
    const [teacher_ID, set_teacher_ID] = React.useState("");
    const [teacher_field,set_teacher_field] = React.useState("");


    useEffect(()=>{
        set_teacher_email(sessionStorage.getItem('teacher_email'));
        set_teacher_first_name(sessionStorage.getItem('teacher_first_name'));
        set_teacher_last_name(sessionStorage.getItem('teacher_last_name'));
        set_teacher_ID(sessionStorage.getItem('teacher_ID'));
        set_teacher_field(sessionStorage.getItem('teacher_field'));
    }, [])

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