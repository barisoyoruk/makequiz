import {useHistory} from 'react-router-dom';

function LandingPage() {
    let history = useHistory();

    return (
        <div id="landing_div">
            <input type="submit" value="Student Login" onClick={()=>history.push('/StudentLoginPage')}></input>
            <input type="submit" value="Student Sign Up" onClick={()=>history.push('/StudentRegisterPage')}></input>
            <input type="submit" value="Teacher Login" onClick={()=>history.push('/TeacherLoginPage')}></input>
            <input type="submit" value="Teacher Sign Up" onClick={()=>history.push('/TeacherRegisterPage')}></input>
        </div>
    )
}

export default LandingPage;