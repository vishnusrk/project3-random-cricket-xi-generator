/*
Vishnu Sreekanth

Random Cricket XI Generator

App.js

This is the primary file of the front end of the Random Cricket XI Generator. 
It has one function, aptly named App, that is responsible for rendering the 
page. The index.js file that is in this same folder renders the App component 
onto the webpage, displaying it inside the 'root' DOM node in the index.html 
file.
*/

import './App.css';
import React from 'react';
import TitleAndInfo from './TitleAndInfo';
import ModeSelectionAndElevenDisplay from './ModeSelectionAndElevenDisplay';

/*
App is a function component. It renders the following, in order: a TitleAndInfo
component and a ModeSelectionAndElevenDisplay component, both of which are 
imported above.
*/

function App() {

  return (
    <div className="uiDisplay">
      <TitleAndInfo/>
      <ModeSelectionAndElevenDisplay/>
    </div>
  );

}

export default App;