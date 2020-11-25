import React from 'react';
import axios from 'axios';
import {config} from './config'

class StudentAssignmentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_assignments_data: [],
        }
        this.attempToAssignment = this.attempToAssignment.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        const student_assignments = JSON.parse(sessionStorage.getItem('student_assignments'));
        const self = this;
        for (let assignment_pk of student_assignments) {
            axios.get(config.api_url + '/assignment/' + assignment_pk, {
                        headers: {Authorization: 'Token ' + token}
            })
            .then(function(assignment_response) {
                const quiz_pk = assignment_response.data.quiz;
                const publication_date = assignment_response.data.publication_date;
                const due_date = assignment_response.data.due_date;
                let quiz_topic;
                let quiz_field;
                let quiz_no;
                let teacher_email;
                let teacher_first_name;
                let teacher_last_name;

                axios.get(config.api_url + '/quiz/' + quiz_pk, {
                            headers: {Authorization: 'Token ' + token}
                })
                .then(function(quiz_response) {
                    const teacher_pk = quiz_response.data.teacher;
                   
                    quiz_topic = quiz_response.data.quiz_topic;
                    quiz_field = quiz_response.data.quiz_field;
                    quiz_no = quiz_response.data.quiz_no;

                    axios.get(config.api_url + '/teacher/' + teacher_pk, {
                               headers: {Authorization: 'Token ' + token}
                    })
                    .then(function(teacher_response) {
                        teacher_email = teacher_response.data.user.email;
                        teacher_first_name = teacher_response.data.user.first_name;
                        teacher_last_name = teacher_response.data.user.last_name;

                        self.setState({
                            student_assignments_data: [...self.state.student_assignments_data, {
                                'publication_date': publication_date,
                                'due_date': due_date,
                                'teacher_email': teacher_email,
                                'teacher_first_name': teacher_first_name,
                                'teacher_last_name': teacher_last_name,
                                'quiz_topic': quiz_topic,
                                'quiz_field': quiz_field,
                                'quiz_no': quiz_no,
                                'assignment_pk': assignment_pk,
                            }]
                        })
                    });
                })
            })
        }
    }

    attempToAssignment(assignment_pk) {
        this.props.history.push('/StudentAttemptAssignmentPage/:' + assignment_pk)
    }

    render() {
        let copy_student_assignments_data = this.state.student_assignments_data;
        copy_student_assignments_data.sort(function(a,b) {
            return b.due_date - a.due_date;
        });

        let quizzesListItems = copy_student_assignments_data.map((data) =>
            <div>
                <AssignmentComponent assignment_data={data} attempToAssignment={this.attempToAssignment}/>
            </div>
        )
        
        return(
            <div>
                <button onClick={()=>this.props.history.push('/StudentMainPage')}>Main Page</button>
                <br/>
                <br/>
                {quizzesListItems}
            </div>
        );
    }
}

function AssignmentComponent(props) {
    return(
        <div>
            <hr/>
            <div>{props.assignment_data.quiz_no}- {props.assignment_data.quiz_topic}</div>
            <div>{props.assignment_data.quiz_field}</div>
            <div>Publication Date: {props.assignment_data.publication_date}</div>
            <div>Due Date: {props.assignment_data.due_date}</div>
            <div>{props.assignment_data.teacher_first_name} {props.assignment_data.teacher_first_name} - {props.assignment_data.teacher_email}</div>
            <br/>
            <button onClick={()=>props.attempToAssignment(props.assignment_data.assignment_pk)}>Attempt To Assignment</button>
            <hr/>
        </div>
    )
}

export default StudentAssignmentPage