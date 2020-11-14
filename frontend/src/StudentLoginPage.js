import {config} from './config'
import React from 'react';
import {trackPromise, usePromiseTracker} from 'react-promise-tracker';
import {useHistory} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import axios from 'axios';


function StudentLoginPage() {
    const [errorMessage,setErrorMessage] = React.useState("");
	const [showErrorMessage, setShowErrorMessage] = React.useState(false);
	const [isSubmitEnabled, enableDisableSubmit] = React.useState(true);

    const history = useHistory();

    const sendStudentLoginForm = e => {
        e.preventDefault();
        // Users should not be able to use submit button while sending and fetching data from REST Api 
        enableDisableSubmit(false);
        
        let request_body = {
            'username': e.target.student_email.value,
            'password': e.target.student_password.value
        };
        
        trackPromise(
            axios.post(config.api_url + '/student/login/', request_body)
            .then(function(response) {
                sessionStorage.setItem('user_token', response.data['token']);
                history.push('/StudentMainPage');
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
            .then(function() {
                enableDisableSubmit(true);
            })
        );
    }

    const goStudentSignUpPage = e => {
        e.preventDefault();
        history.push('/StudentRegisterPage');
    }

    return (
        <div id="student_login_div">
            <form id="student_login_form" onSubmit={sendStudentLoginForm}>
                <div>
                    <label htmlFor="student_email">Email: </label>
                    <input type="email" name="student_email" placeholder="*required" required/>
                </div>
                <div>
                    <label htmlFor="student_password">Password: </label>
                    <input type="password" name="student_password" placeholder="*requried" required/>
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
                ( <input type="submit" value="Sign Up" onClick={goStudentSignUpPage}></input> ):
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

export default StudentLoginPage;