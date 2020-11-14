import React from 'react';
import { useHistory } from 'react-router-dom';

function StudentMainPage() {
    const history = useHistory();

    return (
        <div id="student_main_div">
            <input type="submit" value="My Profile" onClick={()=>history.push('/StudentProfilePage')}></input>
            <input type="submit" value="Sections" onClick={()=>history.push('/StudentSectionsPage')}></input>
            <input type="submit" value="Quizzes" onClick={()=>history.push('/StudentQuizzesPage')}></input>
            <input type="submit" value="Submissions" onClick={()=>history.push('/StudentSubmissionsPage')}></input>
            <input type="submit" value="Results" onClick={()=>history.push('/StudentResultsPage')}></input>
        </div>
    )
}

export default StudentMainPage;