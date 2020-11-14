import React from 'react';
import {useHistory} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

function TeacherRegisterPage() {
    const history = useHistory()

    const [errorMessage,setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [isSubmitEnabled, enableDisableSubmit] = React.useState(true);

    const sendTeacherRegisterForm = e => {
        e.preventDefault();
        enableDisableSubmit(false);

        let request_body = {
            'user': {
                'first_name': e.target.teacher_first_name.value,
                'last_name': e.target.teacher_last_name.value,
                'email': e.target.teacher_email.value,
                'password': e.target.teacher_password.value,
                'password2': e.target.teacher_password1.value
            },
            'teacher_ID': e.target.teacher_ID.value,
            'teacher_field': e.target.teacher_field.value 
        };

        trackPromise(
            axios.post(config.api_url + '/teacher/register/', request_body)
            .then(function(response) {
                history.push('/TeacherLoginPage');
            })
            .catch(function(error) {
                let errorText = "";
	    		// Server Responded. Something wrong with credentials 
	    		if (error.response) {
                    errorText = [JSON.stringify(error.response.data)];
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
        )
    }

    const goTeacherLoginPage = e => {
        e.preventDefault();
        history.push('/TeacherLoginPage');
    }

    return (
        <div id="teacher_register_div">
            <form id="teacher_register_form" onSubmit={sendTeacherRegisterForm}>
                <div>
                    <label htmlFor='teacher_email'>Email: </label>
                    <input type='email' name='teacher_email' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_first_name'>First Name: </label>
                    <input type='text' name='teacher_first_name' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_last_name'>Last Name: </label>
                    <input type='text' name='teacher_last_name' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_password'>Password: </label>
                    <input type='password' name='teacher_password' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_password1'>Password (Again): </label>
                    <input type='password' name='teacher_password1' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_ID'>Teacher ID: </label>
                    <input type='number' name='teacher_ID' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='teacher_field'>Teacher Field: </label>
                    <input type='text' name='teacher_field' placeholder='*required' required/>
                </div>
                <div>
                    { isSubmitEnabled ?
                        ( <input type="submit" value="Sign Up"></input> ):
                        ( <input type="submit" value="Sign Up" disabled></input> )
                    }
                    <LoadingIndicator/>
                </div>
            </form>
            {isSubmitEnabled ?
                ( <input type="submit" value="Login" onClick={goTeacherLoginPage}></input> ):
                ( <input type="submit" value="Login" disabled></input> )
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
        top: "158px",
      }}
    >
      <Loader type="ThreeDots" color="#000" height="30" width="30"/>
    </div>
}

export default TeacherRegisterPage;