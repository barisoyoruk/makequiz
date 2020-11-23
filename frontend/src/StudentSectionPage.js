import React from 'react';
import axios from 'axios';
import {config} from './config'

class StudentSectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_sections_data: [],
        }
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const student_sections = JSON.parse(sessionStorage.getItem('student_sections'));
        const self = this;
        for (let section_pk of student_sections) {
            axios.get(config.api_url + '/section/' + section_pk, {
                        headers: {Authorization: "Token " + token}
            })
            .then(function(response) {
                let teacher_pk = response.data['teacher'];
                axios.get(config.api_url + '/teacher/' + teacher_pk, {
                        headers: {Authorization: "Token " + token}
                })
                .then(function(teacher_response) {
                    self.setState({
                        student_sections_data: [...self.state.student_sections_data, {
                            'section_code': response.data['section_code'],
                            'semester_time': response.data['semester_time'],
                            'teacher_first_name': teacher_response.data['user']['first_name'],
                            'teacher_last_name': teacher_response.data['user']['last_name'],
                            'teacher_email': teacher_response.data['user']['email']
                        }]
                    })
                });
            });
        }
    }

    render() {
        let copy_student_section_data = this.state.student_sections_data;
        copy_student_section_data.sort(function(a,b) {
            return a.section_code - b.section_code;
        })

        const listItems = copy_student_section_data.map((data) =>
            <div>
                <SectionHeaderComponent section_code={data.section_code} semester_time={data.semester_time} 
                                        teacher_first_name={data.teacher_first_name} teacher_last_name={data.teacher_last_name}
                                        teacher_email={data.teacher_email}/>
            </div>
        );

        return(
            <div>
                {listItems}
            </div>
        );
    }
}

function SectionHeaderComponent(props) {
    return (
        <div>
            <div>Section Code: {props.section_code}</div>
            <div>Semester Time: {props.semester_time}</div>
            <div>Teacher: {props.teacher_first_name} {props.teacher_last_name}</div>
            <div>Email: {props.teacher_email}</div>
            <br/>
            <br/>
        </div>
    );
}

export default StudentSectionPage;