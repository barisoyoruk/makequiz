import React from 'react';
import axios from 'axios';
import {config} from './config'

class TeacherSectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher_sections_data: [],
        }
        this.addStudentToSection = this.addStudentToSection.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        let teacher_sections = JSON.parse(sessionStorage.getItem('teacher_sections'));
        let self = this;
        for (let section_pk of teacher_sections) {
            axios.get( config.api_url + '/section/' + section_pk, {
                        headers: {Authorization: "Token " + token}
            })
            .then(function(response) {
                if (response.data['students'].length === 0) {
                    self.setState({
                        teacher_sections_data: [...self.state.teacher_sections_data, {
                            'section_code': response.data['section_code'],
                            'semester_time': response.data['semester_time'],
                            'section_pk': section_pk,
                            'students_data': [],
                        }]
                    });
                }
                else {
                    let students_pk = response.data['students'];

                    let axios_requests_urls = [];
                    for (let student_pk of students_pk) {
                        axios_requests_urls.push(config.api_url + '/student/' + student_pk);
                    }

                    let axios_requests = [];
                    for (let axios_requests_url of axios_requests_urls) {
                        axios_requests.push(axios.get(axios_requests_url, {headers: {Authorization: "Token " + token}}));
                    }
                    
                    let students_data = [];
                    axios.all(axios_requests)
                    .then(axios.spread((...responses) => {
                        for (let student_response of responses) {
                            students_data.push({
                                'student_first_name':  student_response.data['user']['first_name'],
                                'student_last_name': student_response.data['user']['last_name'],
                                'student_ID': student_response.data['student_ID'],
                                'student_class': student_response.data['student_class'],
                                'student_email': student_response.data['user']['email'],
                            })
                        }
                        self.setState({
                            teacher_sections_data: [...self.state.teacher_sections_data, {
                                'section_code': response.data['section_code'],
                                'semester_time': response.data['semester_time'],
                                'section_pk': section_pk,
                                'students_data': students_data,
                            }]
                        });
                    }))
                }
            }
        )}
    }

    addStudentToSection(e, section_pk) {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const student_email = e.target.student_email.value;
        const request_body = {
            'students': [student_email]
        }

        let self = this;
        axios.put(config.api_url + '/section/' + section_pk , request_body, {headers: {Authorization: "Token " + token}})
        .then(function(response) {
            let new_sections_data = self.state.teacher_sections_data
            for (let index in new_sections_data) {
                if (new_sections_data[index].section_pk === section_pk) {
                    console.log(response);
                    new_sections_data[index].students_data.push({
                        'student_first_name': response.data['user']['first_name'],
                        'student_last_name': response.data['user']['last_name'],
                        'student_ID': response.data['student_ID'],
                        'student_class': response.data['student_class'],
                        'student_email': response.data['user']['email'],
                    })
                    self.setState({
                        teacher_sections_data: new_sections_data 
                    })
                    break;
                }
            }
        })
    }        

    render() {
        let listItems = this.state.teacher_sections_data.map((data) =>
            <div>
                <SectionHeaderComponent section_code={data.section_code} semester_time={data.semester_time} section_pk={data.section_pk} addStudentToSection={this.addStudentToSection}/>
                <StudentListComponent students_data={data.students_data}/>
            </div>
        );

        return (
            <ul>
                {listItems}
            </ul>
        )
    }
}


function SectionHeaderComponent(props) {
    return (
        <div>
            <div>Section Code: {props.section_code}</div>
            <div>Semester Time: {props.semester_time}</div>
            <form onSubmit={(e)=>props.addStudentToSection(e, props.section_pk)}>
                <button>Add Student to This Section</button>
                <input type="text" name="student_email" placeholder="Student's Email"></input>
            </form>
            <br/>
            <br/>
        </div>
    );
}

function StudentListComponent(props) {
    let listItems = props.students_data.map((data) =>
        <div>
            <div>Student Name: {data.student_first_name} {data.student_last_name}</div>
            <div>Student ID: {data.student_ID}</div>
            <div>Student Class: {data.student_class}</div>
            <div>Student Email: {data.student_email}</div>
            <br/>
        </div>
    );
    return(
        <ul>
         {listItems}
       </ul>
    )
}


export default TeacherSectionPage;