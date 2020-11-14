import React from 'react';
import { useHistory } from 'react-router-dom';

function TeacherMainPage() {
    const history = useHistory();

    return (
        <div id="teacher_main_div">
            <input type="submit" value="My Profile" onClick={()=>history.push('/TeacherProfilePage')}></input>
            <input type="submit" value="Sections" onClick={()=>history.push('/TeacherSectionsPage')}></input>
            <input type="submit" value="Quizzes" onClick={()=>history.push('/TeacherQuizzesPage')}></input>
            <input type="submit" value="Submissions" onClick={()=>history.push('/TeacherSubmissionsPage')}></input>
            <input type="submit" value="Results" onClick={()=>history.push('/TeacherResultsPage')}></input>
        </div>
    )
}

export default TeacherMainPage;