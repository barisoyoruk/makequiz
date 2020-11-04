import React from 'react'; 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LoginPage from './LoginPage'

function App() {
    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/login" exact component={LoginPage}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
