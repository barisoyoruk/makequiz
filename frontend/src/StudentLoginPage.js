import React from 'react';
import {trackPromise, usePromiseTracker} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import {config} from './config'

class StudentLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            showErrorMessage: false,
            isSubmitEnabled: true,
        };
    }

    sendStudentLoginForm(e) {
        e.preventDefault();
        this.setState({isSubmitEnabled: false});
        
        let request_body = {
            'username': e.target.student_email.value,
            'password': e.target.student_password.value
        };
        
        let errorText;
        var self = this;
        trackPromise(
            axios.post(config.api_url + '/student/login/', request_body)
            .then(function(response) {
                if (response.data['user_type'] === 'ST') {
                    sessionStorage.setItem('token', response.data['token']);
                    sessionStorage.setItem('student_pk', response.data['user_id']);
                    self.props.history.push('/StudentMainPage');
                }
                else {
                    errorText = "Please go Teacher Login Page"
                    self.setState({errorMessage: errorText});
                    self.setState({showErrorMessage: true});
                }
            })
            .catch(function(error) {
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
	    		
	    		self.setState({errorMessage: errorText});
	    		self.setState({showErrorMessage: true});
            })
            .then(function() {
                self.setState({isSubmitEnabled: true});
            })
        );
    }

    goStudentSignUpPage() {
        this.props.history.push('/StudentRegisterPage');
    }

    render() {
        return (
            <div id="student_login_div">
                <form id="student_login_form" onSubmit={(e)=>this.sendStudentLoginForm(e)}>
                    <div>
                        <label htmlFor="student_email">Email: </label>
                        <input type="email" name="student_email" placeholder="*required" required/>
                    </div>
                    <div>
                        <label htmlFor="student_password">Password: </label>
                        <input type="password" name="student_password" placeholder="*requried" required/>
                    </div>
                    <div>
                        {this.state.isSubmitEnabled ?
                            ( <input type="submit" value="Login"></input> ):
                            ( <input type="submit" value="Login" disabled></input> )
                        }
                        <LoadingIndicator/>
                    </div>
                </form>
                {this.state.isSubmitEnabled ?
                    ( <input type="submit" value="Sign Up" onClick={()=>this.goStudentSignUpPage()}></input> ):
                    ( <input type="submit" value="Sign Up" disabled></input> )
                }
                {this.state.showErrorMessage ? 
                    (<div id="login_error_div">
                        <p>
                            {this.state.errorMessage}	
                        </p>
                    </div>) : null
                }	
            </div>
        )
    }
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