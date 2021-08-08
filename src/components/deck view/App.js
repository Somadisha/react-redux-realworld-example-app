import React, { Component } from 'react';
import MainPage from './Component1/MainPage';
import styled from 'styled-components';
import AddButton from './Component1/AddButton';
import BackButton from './Component1/BackButton';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AllCards from './Component1/AllCards';
import Cards from './Component1/Cards';
import Decks from './Component1/Decks';

function App() {
  const PageHeader = styled.div`
        display:flex;
        justify-content:space-between;
        height:50px;
        align-items:center;
        background:gray;
    `
    const Title = styled.h1`
        color: black;
        font-size:24px;
    `
    return (
      <div className="App">
        <PageHeader>
            <BackButton/>
            <Title>Card Manager</Title>
            <AddButton/>
          </PageHeader>
        <Router>
          <Switch>
            <Route exact path="/AllCards" component={AllCards} />
            <Route exact path="/" component={MainPage} />
            <Route exact path="/Decks" component={Decks} />
            <Route exact path="/Cards" component={Cards} />
          </Switch>
        </Router>
      </div>
    );
  
}

export default App;

