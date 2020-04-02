import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Areas from './Components/Areas'
import GenerateList from './Components/GenerateList'
import './scss/Main.scss';
import ContactForm from './Components/Contacts/ContactForm';
// import './App.scss';

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Navbar/>
          <Switch>
  
            <Route path="/generateList" exact>
              <GenerateList />
            </Route>
            <Route path="/contact" exact>
              <ContactForm/>
            </Route>
            <Route path="/">
              <Areas />
            </Route>
  
          </Switch>
        </Router>
      </div>
    )
  }
}

