/*
Vishnu Sreekanth

Random Cricket XI Generator

index.js (server)

This is the primary file for the back end of the Random Cricket XI Generator. 
It uses express.js to connect the front end to the database with app.get. 
There is an app.get call for each of the paths which correspond to each mode,
and one of these paths, depending on what mode is selected, is called for by 
ModeSelectionAndElevenDisplay.js at a time.
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/*
Creates a connection with the MySQL database of cricketers, aptly named 
'cricket', via createPool. 
Note: The user and password here are exclusive to the device I developed this 
on. On any attempts to recreate the database and run this on another device, the 
user and password should be changed to match the credentials of a MySQL user on 
that device.
*/

const db = mysql.createPool({
    host: "localhost",
    user: "randomxigenerator",
    password: "xigeneratorpassword",
    database: "cricket",
});

/*
Uses app.listen to run the server on port 3001.
*/

app.listen(3001, () => {
    console.log("Running on port 3001");
})

/*
app.get call for random mode. In random mode, ModeSelectionAndElevenDisplay.js 
makes a call to /api/get/random, the path that this call corresponds to. Since 
random mode generates a completely random XI of cricketers, a query that 
randomly selects any one cricketer is sent to the database eleven times. 
Each of these times, the cricketer data packet that gets returned is converted 
to a JavaScript object, which is then added to randomPlayingEleven, the array 
for storing the XI. addedCricketers keeps track of the cricketers in the XI, 
and cricketerIsInEleven is set to false if the newly queried cricketer is not 
in the XI. The query is in a while loop with the condition that 
cricketerIsInEleven is true, and this ensures that a given cricketer is not in 
the XI more than once. At the end, randomPlayingEleven is sent back to the 
front end as the response with res.json.
*/

app.get("/api/get/random", async (req, res) => {
    try {
        let randomPlayingEleven = [];
        let addedCricketers = [];
        /*
        Queries the database for 11 cricketers of any role
        */
        for (let i = 0; i < 11; i++) {
            let cricketerIsInEleven = true;
            let cricketer = {};
            while (cricketerIsInEleven) {
                let query = "SELECT * FROM cricketers ORDER BY RAND() LIMIT 1";
                let cricketerDataPacket = await getCricketerByQuery(query);
                cricketer = {
                    name: cricketerDataPacket[0].Name,
                    team: cricketerDataPacket[0].Team.split(" ").join(""),
                    role: cricketerDataPacket[0].Role,
                    battingType: "",
                    bowlingType: "",
                    /*
                    relativePositionNumber is initialized to 4, so if the 
                    cricketer is a bowler, they will get sorted towards the 
                    bottom of the batting order by sortPlayingEleven, as the 
                    fillCricketerData function will not change the 
                    relativePositionNumber of bowlers. 
                    */
                    relativePositionNumber: 4
                };
                fillCricketerData(cricketer, cricketerDataPacket[0]);
                if (!addedCricketers.includes(cricketer.name)) {
                    cricketerIsInEleven = false;
                }
            }
            addedCricketers.push(cricketer.name);
            await addCricketerToPlayingEleven(cricketer, randomPlayingEleven);
        }
        await sortPlayingEleven(randomPlayingEleven);
        res.json(randomPlayingEleven);
    } catch (error) {
        res.json(error);
    }  
});

/*
app.get call for traditional mode. In traditional mode, 
ModeSelectionAndElevenDisplay.js makes a call to /api/get/traditional, the path 
that this call corresponds to. Since traditional mode follows a 'typical' 
cricketing XI template to generate an XI, it follows one of four cricket 
XI models (modelA, modelB, modelC, modelD) in querying players of specific 
roles. Each of these models are arrays of length 4, whose elements all add up 
to 10. The first element represents the number of batsmen in the XI, the 
second element represents the number of allrounders in the XI, the third 
element represents the number of pace bowlers in the XI, and the fourth element 
represents the number of spin bowlers in the XI. The elements all add up to 10 
instead of 11 because one slot in the XI is reserved for a wicketkeeper, which 
is queried for at the end (a traditional cricket XI must have at least one 
wicketkeeper). The same method of querying and storing in the app.get call for 
random mode is used here, with the differences being the queries themselves 
(which query for players of specific roles) and the number of times the specific 
queries are executed (which is based on the model being used, that is randomly 
selected). At the end, traditionalPlayingEleven, the array that stores the 
generated XI, is sent back to the front end as the response with res.json.
*/

app.get("/api/get/traditional", async (req, res) => {
    try {
        let traditionalPlayingEleven = [];
        let modelA = [4, 1, 3, 2];
        let modelB = [5, 0, 3, 2];
        let modelC = [3, 2, 3, 2];
        let modelD = [5, 1, 3, 1];
        let modelToBeUsed = [];
        let addedCricketers = [];
        let randomNum = Math.floor(Math.random() * 4) + 1;
        if (randomNum == 1) {
            modelToBeUsed = modelA;
        } else if (randomNum == 2) {
            modelToBeUsed = modelB;
        } else if (randomNum == 3) {
            modelToBeUsed = modelC;
        } else {
            modelToBeUsed = modelD;
        }
        /*
        Queries the database for batsmen
        */
        for (let i = 0; i < modelToBeUsed[0]; i++) {
            let cricketerIsInEleven = true;
            let cricketer = {};
            while (cricketerIsInEleven) {
                let query = "SELECT * from cricketers WHERE Role=\"Batsman\"" +
                    " ORDER BY RAND() LIMIT 1";
                let cricketerDataPacket = await getCricketerByQuery(query);
                cricketer = {
                    name: cricketerDataPacket[0].Name,
                    team: cricketerDataPacket[0].Team.split(" ").join(""),
                    role: cricketerDataPacket[0].Role,
                    battingType: "",
                    bowlingType: "",
                    relativePositionNumber: 4
                };
                fillCricketerData(cricketer, cricketerDataPacket[0]);
                if (!addedCricketers.includes(cricketer.name)) {
                    cricketerIsInEleven = false;
                }
            }
            addedCricketers.push(cricketer.name);
            await addCricketerToPlayingEleven(
                cricketer, 
                traditionalPlayingEleven
            );
        }
        /*
        Queries the database for allrounders
        */
        for (let i = 0; i < modelToBeUsed[1]; i++) {
            let cricketerIsInEleven = true;
            let cricketer = {};
            while (cricketerIsInEleven) {
                let query = "SELECT * from cricketers WHERE " + 
                    "Role=\"Allrounder\" ORDER BY RAND() LIMIT 1";
                let cricketerDataPacket = await getCricketerByQuery(query);
                cricketer = {
                    name: cricketerDataPacket[0].Name,
                    team: cricketerDataPacket[0].Team.split(" ").join(""),
                    role: cricketerDataPacket[0].Role,
                    battingType: "",
                    bowlingType: "",
                    relativePositionNumber: 4
                };
                fillCricketerData(cricketer, cricketerDataPacket[0]);
                if (!addedCricketers.includes(cricketer.name)) {
                    cricketerIsInEleven = false;
                }
            }
            addedCricketers.push(cricketer.name);
            await addCricketerToPlayingEleven(
                cricketer, 
                traditionalPlayingEleven
            );
        }
        /*
        Queries the database for pace bowlers/pace allrounders
        */
        for (let i = 0; i < modelToBeUsed[2]; i++) {
            let cricketerIsInEleven = true;
            let cricketer = {};
            while (cricketerIsInEleven) {
                let query = "SELECT * from cricketers WHERE " + 
                    "BowlingType=\"Right Pace\" OR BowlingType=\"Left Pace\"" + 
                    " ORDER BY RAND() LIMIT 1";
                let cricketerDataPacket = await getCricketerByQuery(query);
                cricketer = {
                    name: cricketerDataPacket[0].Name,
                    team: cricketerDataPacket[0].Team.split(" ").join(""),
                    role: cricketerDataPacket[0].Role,
                    battingType: "",
                    bowlingType: "",
                    relativePositionNumber: 4
                };
                fillCricketerData(cricketer, cricketerDataPacket[0]);
                if (!addedCricketers.includes(cricketer.name)) {
                    cricketerIsInEleven = false;
                }
            }
            addedCricketers.push(cricketer.name); 
            await addCricketerToPlayingEleven(
                cricketer, 
                traditionalPlayingEleven
            );
        }
        /*
        Queries the database for spin bowlers/spin allrounders
        */
        for (let i = 0; i < modelToBeUsed[3]; i++) {
            let cricketerIsInEleven = true;
            let cricketer = {};
            while (cricketerIsInEleven) {
                let query = "SELECT * from cricketers WHERE " + 
                    "BowlingType=\"Right Spin\" OR BowlingType=\"Left Spin\"" + 
                    " ORDER BY RAND() LIMIT 1";
                let cricketerDataPacket = await getCricketerByQuery(query);
                cricketer = {
                    name: cricketerDataPacket[0].Name,
                    team: cricketerDataPacket[0].Team.split(" ").join(""),
                    role: cricketerDataPacket[0].Role,
                    battingType: "",
                    bowlingType: "",
                    relativePositionNumber: 4
                };
                fillCricketerData(cricketer, cricketerDataPacket[0]);
                if (!addedCricketers.includes(cricketer.name)) {
                    cricketerIsInEleven = false;
                }
            }
            addedCricketers.push(cricketer.name); 
            await addCricketerToPlayingEleven(
                cricketer, 
                traditionalPlayingEleven
            );
        }
        /*
        Queries the database for a wicketkeeper
        */
        let cricketerIsInEleven = true;
        let cricketer = {};
        while (cricketerIsInEleven) {
            let query = "SELECT * from cricketers WHERE " + 
                "Role=\"Wicketkeeper\" ORDER BY RAND() LIMIT 1";
            let cricketerDataPacket = await getCricketerByQuery(query);
            cricketer = {
                name: cricketerDataPacket[0].Name,
                team: cricketerDataPacket[0].Team.split(" ").join(""),
                role: cricketerDataPacket[0].Role,
                battingType: "",
                bowlingType: "",
                relativePositionNumber: 4
            };
            fillCricketerData(cricketer, cricketerDataPacket[0]);
            if (!addedCricketers.includes(cricketer.name)) {
                cricketerIsInEleven = false;
            } 
        }
        await addCricketerToPlayingEleven(cricketer, traditionalPlayingEleven);
        await sortPlayingEleven(traditionalPlayingEleven);
        res.json(traditionalPlayingEleven);
    } catch (error) {
        res.json(error);
    }
});

/*
app.get call for advanced mode. In advanced mode, 
ModeSelectionAndElevenDisplay.js makes a call to /api/get/advanced, the path 
that this call corresponds to. Since the composition of the XI is dependent 
upon the user-selected roles in the eleven dropdown menus in advanced mode, 
this app.get call has a parameter, choices, that is passed here in 
ModeSelectionAndElevenDisplay.js. choices is an array, converted to a string, of 
each of the roles that were selected in the dropdown menus in order, and 
selectionArray is set to it via JSON.parse. Uses the same paradigm as the other 
app.get calls to query the database and store the generated XI. At the end, 
advancedPlayingEleven, the array that stores the generated XI, is sent back to 
the front end as the response with res.json.
*/
app.get("/api/get/advanced", async (req, res) => {
    try {
        let selectionArray = JSON.parse(req.query.choices);
        let advancedPlayingEleven = [];
        let addedCricketers = [];
        for (let i = 0; i < selectionArray.length; i++) {
            /*
            Queries the database for batsmen if the value of the current 
            dropdown menu is "Batsman"
            */
            if (selectionArray[i] === "Batsman") {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * from cricketers WHERE " + 
                        "Role=\"Batsman\" ORDER BY RAND() LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            /*
            Queries the database for wicketkeepers if the value of the current 
            dropdown menu is "Wicketkeeper"
            */
            } else if (selectionArray[i] == "Wicketkeeper") {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * from cricketers WHERE " + 
                        "Role=\"Wicketkeeper\" ORDER BY RAND() LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            /*
            Queries the database for spin bowlers if the value of the current 
            dropdown menu is "Spin Bowler"
            */
            } else if (selectionArray[i] === "Spin Bowler") {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * FROM cricketers WHERE " + 
                        "(Role = \"Bowler\") AND (BowlingType = \"Left Spin\"" + 
                        " OR BowlingType = \"Right Spin\") ORDER BY RAND() " + 
                        "LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            /*
            Queries the database for pace bowlers if the value of the current 
            dropdown menu is "Pace Bowler"
            */
            } else if (selectionArray[i] === "Pace Bowler") {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * FROM cricketers WHERE " + 
                        "(Role = \"Bowler\") AND (BowlingType = \"Left Pace\"" + 
                        " OR BowlingType = \"Right Pace\") ORDER BY RAND() " + 
                        "LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            /*
            Queries the database for allrounders that bowl spin if the value of 
            the current dropdown menu is "Spin Allrounder"
            */
            } else if (selectionArray[i] === "Spin Allrounder") {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * FROM cricketers WHERE " + 
                        "(Role = \"Allrounder\") AND " + 
                        "(BowlingType = \"Left Spin\" OR " + 
                        "BowlingType = \"Right Spin\") ORDER BY RAND() LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            /*
            Queries the database for allrounders that bowl pace if the value of 
            the current dropdown menu is "Pace Allrounder"
            */
            } else {
                let cricketerIsInEleven = true;
                let cricketer = {};
                while (cricketerIsInEleven) {
                    let query = "SELECT * FROM cricketers WHERE " + 
                        "(Role = \"Allrounder\") AND " + 
                        "(BowlingType = \"Left Pace\" OR " + 
                        "BowlingType = \"Right Pace\") ORDER BY RAND() LIMIT 1";
                    let cricketerDataPacket = await getCricketerByQuery(query);
                    cricketer = {
                        name: cricketerDataPacket[0].Name,
                        team: cricketerDataPacket[0].Team.split(" ").join(""),
                        role: cricketerDataPacket[0].Role,
                        battingType: "",
                        bowlingType: "",
                        relativePositionNumber: 4
                    };
                    fillCricketerData(cricketer, cricketerDataPacket[0]);
                    if (!addedCricketers.includes(cricketer.name)) {
                        cricketerIsInEleven = false;
                    }
                }
                addedCricketers.push(cricketer.name);
                await addCricketerToPlayingEleven(
                    cricketer, 
                    advancedPlayingEleven
                );
            }
        }
        res.json(advancedPlayingEleven);
    } catch (error) {
        res.json(error);
    }

});

/*
Function that queries the database with the query passed as a parameter and 
returns the data packet that is returned. Used throughout all of the app.get 
calls to query the database. Returns a promise that does this as the 
app.get calls need to await on the results of the query and receive the data 
packet before the cricketer object is created so that the information is 
available and can promptly be extracted.
*/

function getCricketerByQuery(query) {

    return new Promise((resolve, reject) => {
        try {
            db.query(query, (err, result) => {
                resolve(result);
            });
        } catch (error) {
            reject(error);
        }
    });

}

/*
Function that converts the cricketer data packets returned by the queries to 
JavaScript objects. Extracts information from the data packets, and fills 
the cricketer object's corresponding attributes based upon that information.
*/

function fillCricketerData(cricketer, cricketerDataPacket) {

    if (isRightHandedBatter(cricketerDataPacket)) {
        cricketer.battingType = "Right";
    } else if (isLeftHandedBatter(cricketerDataPacket)) {
        cricketer.battingType = "Left";
    }
    if (isPaceBowler(cricketerDataPacket)) {
        cricketer.bowlingType = "Pace";
    } else if (isSpinBowler(cricketerDataPacket)) {
        cricketer.bowlingType = "Spin";
    }
    if (isTopOrder(cricketerDataPacket)) {
        cricketer.relativePositionNumber = 1;
    } else if (isFloater(cricketerDataPacket)) {
        cricketer.relativePositionNumber = 2;
    } else if (isMiddleOrder(cricketerDataPacket)) {
        cricketer.relativePositionNumber = 3;
    }

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a batsman or allrounder (NOT a bowler!) that is right handed, and false 
otherwise. 
*/

function isRightHandedBatter(cricketer) {

    if (cricketer.BattingType === "Right Top" || 
        cricketer.BattingType === "Right Floater" || 
        cricketer.BattingType === "Right Middle") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a batsman or allrounder (NOT a bowler!) that is left handed, and false 
otherwise. 
*/

function isLeftHandedBatter(cricketer) {

    if (cricketer.BattingType === "Left Top" || 
        cricketer.BattingType === "Left Floater" || 
        cricketer.BattingType === "Left Middle") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a pace bowler or pace allrounder and false otherwise. 
*/

function isPaceBowler(cricketer) {

    if (cricketer.BowlingType === "Right Pace" || 
        cricketer.BowlingType === "Left Pace") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a spin bowler or spin allrounder and false otherwise. 
*/

function isSpinBowler(cricketer) {

    if (cricketer.BowlingType === "Right Spin" || 
        cricketer.BowlingType === "Left Spin") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a top order batsman or allrounder (NOT a bowler!), and false otherwise.
*/

function isTopOrder(cricketer) {

    if (cricketer.BattingType === "Right Top" || 
        cricketer.BattingType === "Left Top") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a batsman or allrounder that can bat near the top or middle (NOT a bowler!), 
and false otherwise.
*/
function isFloater(cricketer) {

    if (cricketer.BattingType === "Right Floater" || 
        cricketer.BattingType === "Left Floater") {
            return true;
    }
    return false;

}

/*
Accepts a cricketer data packet as a parameter, returns true if the cricketer 
is a middle order batsman or allrounder (NOT a bowler!), and false otherwise.
*/

function isMiddleOrder(cricketer) {

    if (cricketer.BattingType === "Right Middle" || 
        cricketer.BattingType === "Left Middle") {
            return true;
    }
    return false;

}

/*
Adds the cricketerToBeAdded to playingEleven. Returns a promise that does this 
as each of the app.get calls need to await on the cricketers being added to 
the playing XI, since they must be added to the XI before the XI array is sent 
back to the front end.
*/

function addCricketerToPlayingEleven(cricketerToBeAdded, playingEleven) {

    return new Promise((resolve, reject) => {
        try {
            playingEleven.push(cricketerToBeAdded);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
    
}

/*
Sorts the playing eleven, passed as a parameter, by the cricketers' relative 
position numbers (which indicate where in the XI's batting order you would 
generally find them, the smaller their relative position number, the higher 
up they generally bat). Uses insertion sort since the dataset is only 11 
elements, making it an efficient choice for a sorting algorithm in this 
scenario. Not called in the app.get call for advanced mode, since in advanced 
mode, the XI should match the order of the dropdown menu values, regardless if 
this order may be in an 'unsorted' fashion with respect to relative position 
numbers. Returns a promise that does this since the XI must be sorted before 
it is returned to the front end.
*/

function sortPlayingEleven(playingEleven) {

    return new Promise((resolve, reject) => {
        try {
            for (let i = 1; i < playingEleven.length; i++) {
                for (let j = i; j > 0; j--) {
                    if (playingEleven[j].relativePositionNumber < 
                        playingEleven[j - 1].relativePositionNumber) {
                            let temp = playingEleven[j - 1];
                            playingEleven[j - 1] = playingEleven[j];
                            playingEleven[j] = temp;
                    }
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });

}