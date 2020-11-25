import React from 'react'; 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './LandingPage';
import StudentLoginPage from './StudentLoginPage';
import TeacherLoginPage from './TeacherLoginPage';
import StudentRegisterPage from './StudentRegisterPage';
import TeacherRegisterPage from './TeacherRegisterPage';
import TeacherMainPage from './TeacherMainPage';
import StudentMainPage from './StudentMainPage';
import StudentProfilePage from './StudentProfilePage';
import TeacherProfilePage from './TeacherProfilePage';
import TeacherSectionPage from './TeacherSectionPage';
import StudentSectionPage from './StudentSectionPage';
import TeacherQuizPage from './TeacherQuizPage';
import TeacherCreateQuizPage from './TeacherCreateQuizPage';
import StudentAssignmentPage from './StudentAssignmentPage';
import StudentAttemptAssignmentPage from './StudentAttemptAssignmentPage';
import StudentSubmissionPage from './StudentSubmissionPage';
import TeacherSubmissionPage from './TeacherSubmissionPage';

function App() {
    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={LandingPage}/>
                    <Route path="/StudentLoginPage" exact component={StudentLoginPage}/>
                    <Route path="/TeacherLoginPage" exact component={TeacherLoginPage}/>
                    <Route path="/StudentRegisterPage" exact component={StudentRegisterPage}/>
                    <Route path="/TeacherRegisterPage" exact component={TeacherRegisterPage}/>
                    <Route path="/TeacherMainPage" exact component={TeacherMainPage}/>
                    <Route path="/StudentMainPage" exact component={StudentMainPage}/>
                    <Route path="/StudentProfilePage" exact component={StudentProfilePage}/>
                    <Route path="/TeacherProfilePage" exact component={TeacherProfilePage}/>
                    <Route path="/TeacherSectionPage" exact component={TeacherSectionPage}/>
                    <Route path="/StudentSectionPage" exact component={StudentSectionPage}/>
                    <Route path="/TeacherQuizPage" exact component={TeacherQuizPage}/>
                    <Route path="/TeacherCreateQuizPage" exact component={TeacherCreateQuizPage}/>
                    <Route path="/StudentAssignmentPage" exact component={StudentAssignmentPage}/>
                    <Route path="/StudentAttemptAssignmentPage/:id" exact component={StudentAttemptAssignmentPage}/>
                    <Route path="/StudentSubmissionPage" exact component={StudentSubmissionPage}/>
                    <Route path="/TeacherSubmissionPage" exact component={TeacherSubmissionPage}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
