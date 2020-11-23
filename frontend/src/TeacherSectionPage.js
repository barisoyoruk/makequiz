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
        this.createNewSection = this.createNewSection.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const teacher_sections = JSON.parse(sessionStorage.getItem('teacher_sections'));
        const self = this;
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
                    const students_pk = response.data['students'];

                    let axios_request_urls = [];
                    for (let student_pk of students_pk) {
                        axios_request_urls.push(config.api_url + '/student/' + student_pk);
                    }

                    let axios_requests = [];
                    for (let axios_request_url of axios_request_urls) {
                        axios_requests.push(axios.get(axios_request_url, {headers: {Authorization: "Token " + token}}));
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
                                'student_email': student_response.data['user']['email']
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
                    }));
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
        };

        const self = this;
        axios.put(config.api_url + '/section/' + section_pk , request_body, {headers: {Authorization: "Token " + token}})
        .then(function(response) {
            let copy_sections_data = self.state.teacher_sections_data
            for (let index in copy_sections_data) {
                if (copy_sections_data[index].section_pk === section_pk) {
                    copy_sections_data[index].students_data.push({
                        'student_first_name': response.data['user']['first_name'],
                        'student_last_name': response.data['user']['last_name'],
                        'student_ID': response.data['student_ID'],
                        'student_class': response.data['student_class'],
                        'student_email': response.data['user']['email'],
                    });
                    self.setState({
                        teacher_sections_data: copy_sections_data 
                    });
                    break;
                }
            }
        });
    }

    createNewSection(e) {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const new_section_code = e.target.section_code.value;
        const new_section_semester_time = e.target.section_semester_time.value;
        const teacher_pk = sessionStorage.getItem('teacher_pk');
        const request_body = {
            'section_code': new_section_code,
            'semester_time': new_section_semester_time,
            'teacher': teacher_pk
        };

        const self = this;
        axios.post(config.api_url + '/section/create/', request_body, {headers: {Authorization: "Token " + token}})
        .then(function(response) {
            self.setState({
                teacher_sections_data: [...self.state.teacher_sections_data, {
                    'section_code': response.data['section_code'],
                    'semester_time': response.data['semester_time'],
                    'section_pk': response.data['pk'],
                    'students_data': [],
                }]
            });
            const teacher_sections = JSON.parse(sessionStorage.getItem('teacher_sections'));
            teacher_sections.push(response.data['pk']);
            sessionStorage.setItem('teacher_sections', JSON.stringify(teacher_sections));
        })
    }
    
    render() {
        let copy_teacher_sections_data = this.state.teacher_sections_data;
        copy_teacher_sections_data.sort(function(a,b) {
            return a.section_code - b.section_code;
        });

        let listItems = copy_teacher_sections_data.map((data) =>
            <div>
                <SectionHeaderComponent section_code={data.section_code} semester_time={data.semester_time} section_pk={data.section_pk} addStudentToSection={this.addStudentToSection}/>
                <StudentListComponent students_data={data.students_data}/>
            </div>
        );



        return (
            <div>
                <NewSectionComponent createNewSection={this.createNewSection}/>
                <br/>
                <br/>
                <ul>
                    {listItems}
                </ul>
            </div>
        )
    }
}

function NewSectionComponent(props) {
    return (
        <div>
            <form onSubmit={(e)=>props.createNewSection(e)}>
                <button>Create New Section</button>
                <input type="text" name="section_code" placeholder="Section's Code"></input>
                <input type="text" name="section_semester_time" placeholder="Section's Semester Time"></input>
            </form>
        </div>
    )
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