/*
Vishnu Sreekanth

Random Cricket XI Generator

TitleAndInfo.js

This is the file for the TitleAndInfo component, which consists of the page's 
title and the instructions for using the random XI generator.
*/

import './App.css';
import React from 'react';

/*
TitleAndInfo is a class component with no state or props. It just renders the 
title and instructions of the random XI generator.
*/

class TitleAndInfo extends React.Component {

    /*
    Render function, which defines what should be rendered as the component.
    */

    render() {
  
      return (
        <div>
            <h1 className="title">
                <center>Random Cricket XI Generator</center>
            </h1>
            <p className="mainDescription">
                <center> This tool randomly generates a playing XI of 
                professional cricketers. There are three modes: Random, 
                Traditional, and Advanced. In Random mode, 11 players are 
                randomly picked and added to the XI. In Traditional mode, a 
                'typical' cricketing XI template is followed, with the randomly 
                generated XI having a reasonable balance of batsmen, 
                allrounders, and bowlers, along with a wicketkeeper. In 
                Advanced mode, you select the specific makeup of the XI using 
                the dropdown menus provided, and players fulfulling each of the 
                selected roles are randomly generated. You can reorder the XI 
                by dragging the player boxes. Have fun!</center>
            </p>
        </div>
      );
  
    }
  
}

export default TitleAndInfo;