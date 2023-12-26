/*
Vishnu Sreekanth

Random Cricket XI Generator

ModeSelectionAndElevenDisplay.js

This is the file for the ModeSelectionAndElevenDisplay component, which 
consists of the radio buttons to select which mode to generate the XI in, 
the dropdown menus if advanced mode is selected, the generate button, and the 
ElevenDisplay component, which shows the generated XI.
*/

import './App.css';
import React from 'react';
import Axios from 'axios';
import ElevenDisplay from './ElevenDisplay';

/*
ModeSelectionAndElevenDisplay is a class component. It has no props, eleven 
refs, and four state attributes. The eleven refs are for the eleven dropdown 
menus in advanced mode, while the four state attributes each serve different 
purposes. selectedMode keeps track of which mode is selected: random (1), 
traditional (2), or advanced (3). buttonPressed keeps track of whether the 
generate button has been pressed. generatedEleven is an array of the generated 
playing XI.
*/

class ModeSelectionAndElevenDisplay extends React.Component {

    /*
    Component constructor, creates all eleven of the refs and initializes 
    each of the state attributes. selectedMode is initialized to 0 since 
    no mode is selected, buttonPressed is initialized to false since the 
    button has not been pressed yet, and generatedEleven is initialized to an
    empty array.
    */

    constructor(props){
  
      super(props);
      this.firstDropdown = React.createRef();
      this.secondDropdown = React.createRef();
      this.thirdDropdown = React.createRef();
      this.fourthDropdown = React.createRef();
      this.fifthDropdown = React.createRef();
      this.sixthDropdown = React.createRef();
      this.seventhDropdown = React.createRef();
      this.eighthDropdown = React.createRef();
      this.ninthDropdown = React.createRef();
      this.tenthDropdown = React.createRef();
      this.eleventhDropdown = React.createRef();
      this.state = {
        selectedMode: 0, 
        buttonPressed: false,
        generatedEleven: [],
      };
  
    }

    /*
    Render function. If buttonPressed is false, then only the mode selection 
    radio buttons and the generate button are rendered, along with the dropdown 
    menu's if advanced mode is selected (when selectedMode is 3). If 
    buttonPressed is true, then the ElevenDusplay component is displayed with 
    the playing XI below the other elements.
    */
  
    render() {
  
      if (!this.state.buttonPressed) {
        if (this.state.selectedMode !== 3) {
          return (
            <div>
              <center>
                <input type="radio" 
                       name="modeSelection" 
                       value="Random" 
                       onClick={() => this.selectRandomMode()}>
                </input>
                <label>Random</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Traditional" 
                       onClick={() => this.selectTraditionalMode()}>
                </input>
                <label>Traditional</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Advanced" 
                       onClick={() => this.selectAdvancedMode()}>
                </input>
                <label>Advanced</label><br></br>
              </center>
              <center>
               <button onClick={() => this.generateEleven()}>Generate</button>
              </center>
            </div>
          );
        } else {
          return (
            <div>
              <center>
                <input type="radio" 
                       name="modeSelection" 
                       value="Random" 
                       onClick={() => this.selectRandomMode()}>
                </input>
                <label>Random</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Traditional" 
                       onClick={() => this.selectTraditionalMode()}>
                </input>
                <label>Traditional</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Advanced" 
                       onClick={() => this.selectAdvancedMode()}> 
                </input>
                <label>Advanced</label><br></br>
              </center>
              <div class="advancedModeDropdowns">
                <center>
                    <p>1.</p>
                    <select id="inAt1" ref={this.firstDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>2.</p>
                    <select id="inAt2" ref={this.secondDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>3.</p>
                    <select id="inAt3" ref={this.thirdDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>4.</p>
                    <select id="inAt4" ref={this.fourthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>5.</p>
                    <select id="inAt5" ref={this.fifthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>6.</p>
                    <select id="inAt6" ref={this.sixthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>7.</p>
                    <select id="inAt7" ref={this.seventhDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>8.</p>
                    <select id="inAt8" ref={this.eighthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>9.</p>
                    <select id="inAt9" ref={this.ninthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>10.</p>
                    <select id="inAt10" ref={this.tenthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>11.</p>
                    <select id="inAt11" ref={this.eleventhDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                </center>
              </div>
              <center>
               <button onClick={() => this.generateEleven()}>Generate</button>
              </center>
            </div>
          );
        }
      } else {
        if (this.state.selectedMode !== 3) {
          return (
            <div>
              <center>
                <input type="radio" 
                       name="modeSelection" 
                       value="Random" 
                       onClick={() => this.selectRandomMode()}>
                </input>
                <label>Random</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Traditional" 
                       onClick={() => this.selectTraditionalMode()}>
                </input>
                <label>Traditional</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Advanced" 
                       onClick={() => this.selectAdvancedMode()}>
                </input>
                <label>Advanced</label><br></br>
              </center>
              <center>
               <button onClick={() => this.generateEleven()}>Generate</button>
              </center>
              <center>
               <ElevenDisplay eleven={this.state.generatedEleven}/>
              </center>
            </div>
          );
        } else {
          return (
            <div>
              <center>
                <input type="radio" 
                       name="modeSelection" 
                       value="Random" 
                       onClick={() => this.selectRandomMode()}>
                </input>
                <label>Random</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Traditional" 
                       onClick={() => this.selectTraditionalMode()}>
                </input>
                <label>Traditional</label><br></br>
                <input type="radio" 
                       name="modeSelection" 
                       value="Advanced" 
                       onClick={() => this.selectAdvancedMode()}>
                </input>
                <label>Advanced</label><br></br>
              </center>
              <div class="advancedModeDropdowns">
                <center>
                    <p>1.</p>
                    <select id="inAt1" ref={this.firstDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>2.</p>
                    <select id="inAt2" ref={this.secondDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>3.</p>
                    <select id="inAt3" ref={this.thirdDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>4.</p>
                    <select id="inAt4" ref={this.fourthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>5.</p>
                    <select id="inAt5" ref={this.fifthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>6.</p>
                    <select id="inAt6" ref={this.sixthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>7.</p>
                    <select id="inAt7" ref={this.seventhDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>8.</p>
                    <select id="inAt8" ref={this.eighthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>9.</p>
                    <select id="inAt9" ref={this.ninthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>10.</p>
                    <select id="inAt10" ref={this.tenthDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                    <p>11.</p>
                    <select id="inAt11" ref={this.eleventhDropdown}>
                      <option value="Batsman">Batsman</option>
                      <option value="Wicketkeeper">Wicketkeeper Batsman</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                      <option value="Pace Bowler">Pace Bowler</option>
                      <option value="Spin Allrounder">Allrounder (Spin)</option>
                      <option value="Pace Allrounder">Allrounder (Pace)</option>
                    </select><br></br>
                </center>
              </div>
              <center>
               <button onClick={() => this.generateEleven()}>Generate</button>
              </center>
              <center>
               <ElevenDisplay eleven={this.state.generatedEleven}/>
              </center>
            </div>
          );
        }
      }
    }
  
    /*
    Onclick function for the random mode radio button. Sets selectedMode to 1, 
    so that the generateEleven() function knows to generate an XI in random 
    mode when the generate button is clicked.
    */

    selectRandomMode() {
  
      this.setState({selectedMode: 1});
  
    }
  
    /*
    Onclick function for the traditional mode radio button. Sets selectedMode 
    to 2, so that the generateEleven() function knows to generate an XI in 
    traditional mode when the generate button is clicked.
    */

    selectTraditionalMode() {
  
      this.setState({selectedMode: 2});
  
    }

    /*
    Onclick function for the advanced mode radio button. Sets selectedMode 
    to 3, so that the generateEleven() function knows to generate an XI in 
    advanced mode when the generate button is clicked, and so that render() 
    knows to display the eleven dropdown menus.
    */
  
    selectAdvancedMode() {
  
      this.setState({selectedMode: 3});
  
    }

    /* 
    Onclick function for the generate button that generates the playing XI.
    Based on selectedMode, it makes a "read" API call to the back end with 
    Axios.get, under the mode that selectedMode corresponds to. It then sets 
    generatedEleven to the response of the call, which is then displayed by 
    the ElevenDisplay component. It also updates buttonPressed to be true, so 
    that the ElevenDisplay component is visible.
    */
  
    generateEleven() {
  
      if (this.state.selectedMode === 1) {
        Axios.get("http://localhost:3001/api/get/random").then((response) => {
          let eleven = response.data;
          this.setState({generatedEleven: eleven}, () => {
            this.setState({buttonPressed: true});
          });
        });
      } else if (this.state.selectedMode === 2) {
        Axios.get("http://localhost:3001/api/get/traditional").then(
          (response) => {
            let eleven = response.data;
            this.setState({generatedEleven: eleven}, () => {
              this.setState({buttonPressed: true});
            });
          }
        );
      /*
      If advanced mode is selected, an array of the values of the dropdown 
      menus, which are accessed through the eleven refs, is passed to the 
      backend as a string so that the backend knows what the user selected 
      in each dropdown and can accordingly return an XI.
      */
      } else if (this.state.selectedMode === 3) {
        let selectionArray = [
          this.firstDropdown.current.value, this.secondDropdown.current.value, 
          this.thirdDropdown.current.value, this.fourthDropdown.current.value, 
          this.fifthDropdown.current.value, this.sixthDropdown.current.value, 
          this.seventhDropdown.current.value, this.eighthDropdown.current.value, 
          this.ninthDropdown.current.value, this.tenthDropdown.current.value, 
          this.eleventhDropdown.current.value
        ];
        let selectionArrayString = 
        "?choices=" + encodeURIComponent(JSON.stringify(selectionArray));
        Axios.get(
          "http://localhost:3001/api/get/advanced" + selectionArrayString
        ).then(
          (response) => {
            let eleven = response.data;
            this.setState({generatedEleven: eleven}, () => {
              this.setState({buttonPressed: true});
            });
          }
        );
      } else {
        window.alert("Please select a mode.");
      }
  
    }
  
}

export default ModeSelectionAndElevenDisplay;