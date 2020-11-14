import {config} from './config'
import React from 'react';
import {trackPromise, usePromiseTracker} from 'react-promise-tracker';
import {useHistory} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import axios from 'axios';

function TeacherLoginPage() {
    const [errorMessage,setErrorMessage] = React.useState("");
	const [showErrorMessage, setShowErrorMessage] = React.useState(false);
	const [isSubmitEnabled, enableDisableSubmit] = React.useState(true);

    const history = useHistory();

    const sendTeacherLoginForm = e => {
        e.preventDefault();
        // Users should not be able to use submit button while sending and fetching data from REST Api 
        enableDisableSubmit(false);
        
        let request_body = {
            'username': e.target.teacher_email.value,
            'password': e.target.teacher_password.value
        };
        
        trackPromise(
            axios.post(config.api_url + '/teacher/login/', request_body)
            .then(function(response) {
                sessionStorage.setItem('user_token', response.data['token']);
                history.push('/TeacherMainPage');
            })
            .catch(function(error) {
	    		let errorText;
	    		// Server Responded. Something wrong with crediatn
	    		if (error.response) {
                    errorText = "Please control your email and password.";
	    		}
	    		// Server did not Respond. Something wrong with server
	    		else if (error.request) {
	    			errorText = ["Server does not respond. Please try again later."];
	    		}
	    		else {
	    			errorText = [error.message];
	    		}
	    		
	    		setErrorMessage(errorText);
	    		setShowErrorMessage(true);
            })
            .then(function () {
                enableDisableSubmit(true);
            })
        );
    }

    const goTeacherSignUpPage = e => {
        e.preventDefault();
        history.push('/TeacherRegisterPage');
    }

    return (
        <div id="teacher_login_div">
            <form id="teacher_login_form" onSubmit={sendTeacherLoginForm}>
                <div>
                    <label htmlFor="teacher_email">Email: </label>
                    <input type="email" name="teacher_email" placeholder="*required" required/>
                </div>
                <div>
                    <label htmlFor="teacher_password">Password: </label>
                    <input type="password" name="teacher_password" placeholder="*requried" required/>
                </div>
                <div>
                    { isSubmitEnabled ?
                        ( <input type="submit" value="Login"></input> ):
                        ( <input type="submit" value="Login" disabled></input> )
                    }
                    <LoadingIndicator/>
                </div>
            </form>
            { isSubmitEnabled ?
                ( <input type="submit" value="Sign Up" onClick={goTeacherSignUpPage}></input> ):
                ( <input type="submit" value="Sign Up" disabled></input> )
            }
            {showErrorMessage ? 
                (<div id="login_error_div">
                    <p>
                        {errorMessage}	
                    </p>
                </div>) : null
            }	
        </div>
    )
}

const LoadingIndicator = props => {
	const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && 
    <div
      style={{
        display: "inline-block",
        position: "absolute",
        left: "70px",
        top: "45px",
      }}
    >
      <Loader type="ThreeDots" color="#000" height="30" width="30"/>
    </div>
}

export default TeacherLoginPage;