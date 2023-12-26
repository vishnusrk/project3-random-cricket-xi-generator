/*
Vishnu Sreekanth

Random Cricket XI Generator

ElevenDisplay.js

This is the file for the ElevenDisplay component, which is responsible for 
displaying the generated playing XI. It displays each of the eleven players 
in eleven rectangles, which are draggable and can be reordered. 
*/

import './App.css';
import React from 'react';

/*
ElevenDisplay is a class component. It has one props attribute and three state 
attributes. The props attribute is the array of the eleven players to be 
displayed. The state attributes serve different purposes. dragging and 
draggingOver allow for the rectangles with the player names to be draggable and 
reorderable, and playingEleven stores the playing XI. 
*/

class ElevenDisplay extends React.Component {
  
    /*
    Component constructor, sets dragging and draggingOver to 100, a number 
    far outside of the range of 0-10 (the indices of each of the eleven 
    players). The significance of dragging and draggingOver is explained above 
    the render and switchPositions functions. Sets playingEleven to the props 
    attribute eleven, the generated playing XI.
    */

    constructor(props) {
  
      super(props);
      this.state = {
        dragging: 100,
        draggingOver: 100,
        playingEleven: this.props.eleven,
      }
  
    }
    
    /*
    Render function, uses map() to render each of the players in the XI within
    their own rectangles, with the images corresponding to their team and 
    role at the left and right respectively. Each rectangle is draggable, and 
    if a rectangle is selected and dragged, dragging is set to the index of the 
    player in the playingEleven array that is in that rectangle. If the 
    rectangle being dragged goes over another rectangle (enters that rectangle's 
    space according to onDragEnter), draggingOver gets the index of the latter 
    rectangle. switchPositions is called to reorder the rectangles using the 
    indices stored by dragging and draggingOver when dragging is finished. Also 
    renders a button to copy the playing XI to the clipboard.
    */

    render() {
  
      return(
        <div className="playingElevenContainer">
          {this.state.playingEleven.map((player, index) => {
            return (
              <div key={index} 
                   className="playerBox" 
                   draggable 
                   onDragStart={
                    (e) => (this.setState({dragging: index}))
                   } 
                   onDragEnter={(e) => (this.setState({draggingOver: index}))} 
                   onDragEnd={(e) => (this.switchPositions())} 
                   onDragOver={(e) => (e.preventDefault())}>
                <img src={require('.//images/' + player.team + '.png')} 
                     alt={player.team}>
                </img>
                <h2>{player.name}</h2>
                <img src={
                      require('.//images/' + player.role + player.battingType + 
                        player.bowlingType + '.png')
                     } 
                     alt={player.role}>
                </img>
              </div>
            );
          })}
          <center>
            <button className="copyButton" 
                    onClick={() => this.copyElevenToClipboard()}>
              Copy XI to Clipboard
            </button>
          </center>
        </div>
      );
  
    }

    /*
    Onclick for the copy button. Creates a numbered string with all of the 
    players in the playing XI, and copies it to the user's clipboard.
    */
  
    copyElevenToClipboard() {
  
      let elevenString = "";
      this.state.playingEleven.map((player, index) => {
        elevenString += (index + 1) + ". " + player.name
        if (index !== 10) {
          elevenString += "\n"
        }
        return true;
      });
      navigator.clipboard.writeText(elevenString);
  
    }

    /*
    getDerivedStateFromProps function, invoked right before render is executed. 
    Used to update the state based upon changes to the props. Props are 
    read-only and thus cannot be reordered, which is why the state attribute 
    playingEleven exists and is displayed instead of the props attribute 
    eleven. Updates the state to match the props attribute under two conditions: 
    if the props XI and state XI do not match, and if they do not have the same 
    eleven players. The latter is checked because if the user decides to 
    reorder the XI, and the latter wasn't checked, their reordered version 
    wouldn't show since the props remains the same and the props and state 
    would not be equal because of the new order, so the state would be updated 
    to match the props again, hence the reordered version wouldn't show. 
    Checking both ensures that each time the generate button is clicked, a 
    newly generated XI is shown, unless the same eleven players happen to be 
    generated twice in a row (which is extremely rare), in which case the XI 
    would simply be unchanged, and the reordered version would be retained. 
    */
  
    static getDerivedStateFromProps(props, state) {
      
      let elevensHaveSamePlayers = true;
      for (let i = 0; i < state.playingEleven.length; i++) {
        if (props.eleven.length > 0) {
          if (!props.eleven.includes(state.playingEleven[i])) { 
            elevensHaveSamePlayers = false;
          }
        }
      }
      if ((state.playingEleven !== props.eleven && !elevensHaveSamePlayers)) {
        return {
          playingEleven: props.eleven,
        };
      } else {
        return null;
      }
  
    }

    /*
    Function to be executed when the onDragEnd listener detects when dragging 
    has stopped. Switches the positions of the dragged rectangle and the 
    rectangle it was dragged over in the XI, using their indices which were 
    stored in dragging and draggingOver respectively via the onDragStart and 
    onDragEnter listeners. This causes the XI to be reordered, and the 
    component to be re-rendered as the state is updated to be the reordered XI.
    */
  
    switchPositions() {
      
      let temp = [...this.state.playingEleven];
      const draggedElement = temp.splice(this.state.dragging, 1)[0];
      temp.splice(this.state.draggingOver, 0, draggedElement);
      this.setState({dragging: 100, draggingOver: 100, playingEleven: temp});
      
    }
  
}

export default ElevenDisplay;