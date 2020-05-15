import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import AddEvent from "./components/AddEvent.jsx";
import Event from "./components/Event.jsx";

function App() {
  return (
    <main>
      <div className="d-flex justify-content-center">
        <div className="container m-2 p-1 w-100">
          <div className="card p-3">
            <div className="card-title text-center">
              <h3 className="text-info">3322 Event Management System</h3>
            </div>
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/main' component={Home} exact />
              <Route path='/signup' component={SignUp} exact />
              <Route path='/login' component={Login} exact />
              <Route path='/logout' component={Logout} exact />
              <Route path='/addevent' component={AddEvent} exact />
              <Route path='/events/:eventId' component={Event} />
              <Route component={Error} />
            </Switch>
          </div>
        </div>
      </div>
    </main>
  )
}

function Error(props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.history.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div class="container">
      <h1>Sorry, page not found.</h1>
      <h1>You will be redirected shortly.</h1>
    </div>
  )
}

export default App;
