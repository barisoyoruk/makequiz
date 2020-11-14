import React from 'react'; 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './LandingPage'
import StudentLoginPage from './StudentLoginPage'
import TeacherLoginPage from './TeacherLoginPage'
import StudentRegisterPage from './StudentRegisterPage'
import TeacherRegisterPage from './TeacherRegisterPage'
import TeacherMainPage from './TeacherMainPage'
import StudentMainPage from './StudentMainPage'
import StudentProfilePage from './StudentProfilePage'
import TeacherProfilePage from './TeacherProfilePage'

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
                </Switch>
            </div>
        </Router>
    );
}

export default App;
