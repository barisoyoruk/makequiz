import React, {useState} from 'react'; 
import {useHistory} from 'react-router-dom'

function LoginPage() {
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [isSubmitEnabled, enableDisableSubmit] = React.useState(true);

    return (
        <div>
            <form>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" name="email" placeholder="*required" required/>
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" placeholder="*requried" required/>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;