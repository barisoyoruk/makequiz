import React from 'react';
import {trackPromise, usePromiseTracker} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import {config} from './config'

class TeacherLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            showErrorMessage: false,
            isSubmitEnabled: true,
        };
    }

    sendTeacherLoginForm(e) {
        e.preventDefault();
        this.setState({isSubmitEnabled: false});
        
        const request_body = {
            'username': e.target.teacher_email.value,
            'password': e.target.teacher_password.value
        };
        
        let errorText;
        const self = this;
        trackPromise(
            axios.post(config.api_url + '/teacher/login/', request_body)
            .then(function(response) {
                if (response.data['user_type'] === 'TE') {
                    sessionStorage.setItem('token', response.data['token']);
                    sessionStorage.setItem('teacher_pk', response.data['user_id']);
                    self.props.history.push('/TeacherMainPage');
                }
                else {
                    errorText = "Please go Student Login Page"
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
	    			errorText = "Server does not respond. Please try again later.";
	    		}
	    		else {
	    			errorText = error.message;
	    		}
	    		
	    		self.setState({errorMessage: errorText});
	    		self.setState({showErrorMessage: true});
            })
            .then(function() {
                self.setState({isSubmitEnabled: true});
            })
        );
    }

    goTeacherSignUpPage() {
        this.props.history.push('/TeacherRegisterPage')
    }

    render() {
        return (
            <div id="teacher_login_div">
                <form id="teacher_login_form" onSubmit={(e)=>this.sendTeacherLoginForm(e)}>
                    <div>
                        <label htmlFor="teacher_email">Email: </label>
                        <input type="email" name="teacher_email" placeholder="*required" required/>
                    </div>
                    <div>
                        <label htmlFor="teacher_password">Password: </label>
                        <input type="password" name="teacher_password" placeholder="*requried" required/>
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
                    ( <input type="submit" value="Sign Up" onClick={()=>this.goTeacherSignUpPage()}></input> ):
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

export default TeacherLoginPage;