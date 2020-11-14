import {useHistory} from 'react-router-dom';

function LandingPage() {

    const history = useHistory();

    const goStudentLoginPage = e => {
        e.preventDefault();
        history.push('/StudentLoginPage');
    }

    const goStudentSignUpPage = e => {
        e.preventDefault();
        history.push('/StudentRegisterPage');
    }

    const goTeacherLoginPage = e => {
        e.preventDefault();
        history.push('/TeacherLoginPage');
    }

    const goTeacherSignUpPage = e => {
        e.preventDefault();
        history.push('/TeacherRegisterPage');
    }

    return (
        <div id="landing_div">
            <input type="submit" value="Student Login" onClick={goStudentLoginPage}></input>
            <input type="submit" value="Student Sign Up" onClick={goStudentSignUpPage}></input>
            <input type="submit" value="Teacher Login" onClick={goTeacherLoginPage}></input>
            <input type="submit" value="Teacher Sign Up" onClick={goTeacherSignUpPage}></input>
        </div>
    )
}

export default LandingPage;