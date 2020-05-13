import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
function App() {
  return (
    <main>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/main' component={Home} exact />
        <Route path='/signup' component={SignUp} exact />
        <Route path='/login' component={Login} exact />
        <Route component={Error} />
      </Switch>
    </main>
  )
}

function Error(props) {
  useEffect((props) => {
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
