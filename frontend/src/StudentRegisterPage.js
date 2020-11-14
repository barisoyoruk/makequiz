import React from 'react';
import {useHistory} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import {config} from './config'

function StudentRegisterPage() {
    const history = useHistory();

    const [errorMessage,setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [isSubmitEnabled, enableDisableSubmit] = React.useState(true);

    const sendStudentRegisterForm = e => {
        e.preventDefault();
        enableDisableSubmit(false);

        let request_body = {
            'user': {
                'first_name': e.target.student_first_name.value,
                'last_name': e.target.student_last_name.value,
                'email': e.target.student_email.value,
                'password': e.target.student_password.value,
                'password2': e.target.student_password1.value
            },
            'student_ID': e.target.student_ID.value,
            'student_class': e.target.student_class.value 
        };

        trackPromise(
            axios.post(config.api_url + '/student/register/', request_body)
            .then(function(response) {
                history.push('/StudentLoginPage');
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

    const goStudentLoginPage = e => {
        e.preventDefault();
        history.push('/StudentLoginPage');
    }

    return (
        <div id="student_register_div">
            <form id="student_register_form" onSubmit={sendStudentRegisterForm}>
                <div>
                    <label htmlFor='student_email'>Email: </label>
                    <input type='email' name='student_email' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='student_first_name'>First Name: </label>
                    <input type='text' name='student_first_name' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='student_last_name'>Last Name: </label>
                    <input type='text' name='student_last_name' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='student_password'>Password: </label>
                    <input type='password' name='student_password' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='student_password1'>Password (Again): </label>
                    <input type='password' name='student_password1' placeholder='*required' required/>
                </div>
                <div>
                    <label htmlFor='student_ID'>Student ID: </label>
                    <input type='number' name='student_ID' placeholder='*required' required/>
                </div>
                <input list="student_classes" name="student_class"></input>
                <datalist id="student_classes">
                    <option value="Freshman"></option>
                    <option value="Sophomore"></option>
                    <option value="Junior"></option>
                    <option value="Senior"></option>
                </datalist>
                <div>
                    { isSubmitEnabled ?
                        ( <input type="submit" value="Sign Up"></input> ):
                        ( <input type="submit" value="Sign Up" disabled></input> )
                    }
                    <LoadingIndicator/>
                </div>
            </form>
            {isSubmitEnabled ?
                ( <input type="submit" value="Login" onClick={goStudentLoginPage}></input> ):
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

export default StudentRegisterPage;