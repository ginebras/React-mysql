import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//COMPONENTS
import Home from './components/home';
import Employees from './components/employees';
import Department from './components/department';
import Navbar from './components/navbar';

var App = () => {
  return (
    <Router>
      <Navbar />
      <div></div>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/department" component={Department} />
        <Route exact path="/employees" component={Employees} />
      </Switch>
    </Router>
  );
};

export default App;
