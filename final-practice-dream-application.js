//Note: You can search for "Lesson" to find all the comments explaining where each skill was covered.
//Note: There are a lot of if-else statements, so I avoided putting a "Lesson: Control Structures and Logic" comment next to all of them. I hope that's okay and makes it more readable.

//pseudocode overview:
//chord1 = getUserInput()
//chord2 = getUserInput()
//chord1Root = findRoot(chord1)
//chord2Root = findRoot(chord2)
//brightnessScore = getBrightness(chord1Root, chord2Root)
//log(brightnessScore) *Will be a negative or positive number.

//*Lesson: Values, Data Types, and Operations*
//The "notes" object is used to get the distance between notes chromatically, 
//enharmonic notes have the same pitch, so they are given the same value (such as "c♯" and "d♭")
let notes = {"c": 1, "b♯": 1,  "c♯": 2, "d♭": 2, "d": 3, "d♯": 4, "e♭": 4, "e": 5, "f♭": 5, "e♯": 6,"f": 6, "f♯": 7, "g♭": 7, "g": 8, "g♯": 9, "a♭": 9, "a": 10, "a♯": 11, "b♭": 11, "b": 12, "c♭": 12};
//Used to get the distance between two roots along the circle of fifths
let circleOfFifths = {"f♭": 4, "b♯": 5, "c♭": 5,"g♭": -6, "d♭": -5, "a♭": -4, "e♭": -3, "b♭": -2,"e♯": -1,"f": -1, "c": 0, "g": 1, "d": 2, "a": 3, "e": 4, "b": 5, "f♯": 6, "c♯": -5, "g♯": -4, "d♯": -3, "a♯": -2};

//Some prewritten chords. Copy and paste into "firstChord" and "secondChord" below to test them out, or write your own (major and minor triads and 7th chords only)
let cMajor = "egc";//1st inversion
let cMajorFullOfGarbage = "4C ?e h+ G";//From C major, brightness to C major should be 0
let gMajor = "dgb";//2nd inversion. From C major, brightness to G major should be 1
let aMinor = "cea";//1st inversion. From C major, brightness to A minor should be 0
let eMinor7 = "egbd";//From C major, brightness to E minor should be 1
let aMajor7= "ac♯eg";//From C major, brightness to A major should be 3
let bFlatMajor7 = "dfab♭";//1st inversion. From C major, brightness to Bflat majorshould be -2
let eFlatMinor7 = "d♭e♭g♭b♭";//3rd inversion. From C major, brightness to Eflat minor should be 6 (or -6, same distance)
let fSharpMajor = "f♯a♯c♯";//From C major, brightness to Fsharp major should be 1

//Getting chord info from the user, or from the sound file.
let firstChord = cMajor;

let secondChord = fSharpMajor;

console.log("The chords entered are " + firstChord + " and " + secondChord);//*Lesson: Stringing Characters Together*

let chordArray1 = getNoteArray(firstChord);//This filters out junk, converts to lower case and turns it into an Array of notes, with the right flats and sharps attached within each index.
let chord1Root = toRootPosition(chordArray1);//This take the formatted array and transforms it into root position, which we need in order to know the root note of the chord.
console.log("Chord one in root position is: " + chord1Root.join(""));//*Lesson: Using Arrays & Lesson: Stringing Characters Together*

let chordArray2 = getNoteArray(secondChord);
let chord2Root = toRootPosition(chordArray2);
console.log("Chord two in root position is: " + chord2Root.join(""));//*Lesson: Using Arrays & Lesson: Stringing Characters Together*

let cToGBrightness = getBrightness(chord1Root, chord2Root);//Takes two chords and rates the modulation according to its movement along the circle of fifths.

console.log(`The brightness modulating from ${firstChord}(${chord1Root.join("")}) to ${secondChord}(${chord2Root.join("")}) is ${cToGBrightness}`);//*Lesson: Stringing Characters Together*


function getNoteArray(chord){
    //Takes a string containing a chord and turns it into an Array of notes, with the correct flats and sharps attached.
    let noteArray = [];//*Lesson: Building Arrays*

    for (i=0; i < chord.length; i++){//*Lesson: Working with Loops*
        if (Object.keys(notes).includes(chord[i].toLowerCase())){//*Lesson: Control Structures and Logic and Lesson: Stringing Characters Together. (If-else statements and .length)*
            if (chord[i+1] === "♭" || chord[i + 1] === "♯"){
                noteArray.push(chord[i].toLowerCase() + chord[i + 1]);//*Using Arrays*
            }
            else{
                noteArray.push(chord[i].toLowerCase());//*Using Arrays*
            }
        }
    }
    return noteArray;
}

//pseudocode
//function getRootPosition(chord){
//  for each note in chord:
//      if the interval between note and nextNote is a certain interval (1 or 2 for some chords, 5 for others):
//          rearrange string so that nextNote is on the bottom (i.e. first note in the array)}
function toRootPosition(chord){
    //takes an array of chord notes and converts it to root position, then returns the new array.
    let rootPosition = chord;

    //Major or minor triad
    if (chord.length === 3){//*Lesson: Control Structures and Logic.
        for (i = 0; i<chord.length; i++){//*Lesson: Working with Loops*
            //For a major or minor triad in first or second inversion, the fifth and root note will be separated by a fourth (5 semitones)
            if (getInterval(chord[i], chord[i+1]) === 5){
                let precedingNotes = chord.splice(0,i+1);//*Lesson: Using Arrays
                rootPosition = chord.concat(precedingNotes);//*Lesson: Using Arrays
            }
        }
    }
    //major or minor seventh chord
    else if (chord.length === 4){
        for (i = 0; i<chord.length; i++){//*Lesson: Working with Loops*
            //For a major or minor seventh chord in first, second or third inversion, the seventh and root note will be separated by a second (1 or 2 semitones)
            if (getInterval(chord[i], chord[i+1]) === 1 || getInterval(chord[i], chord[i+1]) === 2 ){
                let precedingNotes = chord.splice(0,i+1);//*Lesson: Using Arrays*
                rootPosition = chord.concat(precedingNotes);//*Lesson: Using Arrays*
            }
        }
    }
    return rootPosition;
}

//pseudocode:
//function getBrightness(chord1Root, chord2Root){
//  if chords are the same tonality:
//      distance = root2PositionOnCircleOfFifths - root1PositionOnCircleOfFifths 
//  else if chords are different tonality:
//      if chord1Root === minor:
//          adjust to relative major
//      if chord2Root === minor:
//          adjust to relative major
//      distance = root2PositionOnCircleOfFifths - root1PositionOnCircleOfFifths 
//  return distance(brightness)
function getBrightness(chord1, chord2) {
    let chord1Tonality = getTonality(chord1);
    console.log("chord 1's tonality is " + chord1Tonality);//*Lesson: Stringing Characters Together.*
    let chord2Tonality = getTonality(chord2);
    console.log("chord 2's tonality is " + chord2Tonality);//*Lesson: Stringing Characters Together.*
    let distance = 0;

    if ((chord1Tonality === "major" && chord2Tonality === "major") ||
        (chord1Tonality === "minor" && chord2Tonality === "minor")){
        //If the chords are of the same type, then the brightness will be the same as their distance from each other along the circle of fifths.
        distance = circleOfFifths[chord2[0]] - circleOfFifths[chord1[0]];//*Lesson: Using Arrays*
    }
    else {
        //If one chord is major and the other is minor, we'll convert the minor one to its relative major.
        //It's not a perfect solution, but a better one would be much more complicated.
        if (chord1Tonality === "minor"){
            let relativeMajorNum = Number(notes[chord1[0]] + 3);//*Lesson: Using Arrays and Values, Data Types, and Operations*
            relativeMajorNum = wrapNoteValue(relativeMajorNum);
            distance = circleOfFifths[chord2[0]] - circleOfFifths[getNoteFromValue(relativeMajorNum)];//*Lesson: Using Arrays*
        }
        else if (chord2Tonality === "minor"){
            let relativeMajorNum = Number(notes[chord2[0]]) + 3;//*Lesson: Using Arrays and Values, Data Types, and Operations*
            relativeMajorNum = wrapNoteValue(relativeMajorNum);
            distance = circleOfFifths[getNoteFromValue(relativeMajorNum)] - circleOfFifths[chord1[0]];//*Lesson: Using Arrays*
        }
        else {
            console.log("Chord mismatch. Make sure each chord is either major or minor. No jazz please.");
        }
    }

    brightness = findShortestPathCircleOfFifths(distance);
    return brightness;
}

function getTonality(chord){
    //takes a chord, determines whether it is major or minor and returns the result
    let interval = getInterval(chord[0], chord[1]);
    if (interval === 3) {//*Lesson: Control Structures and Logic*
        return "minor";
    }
    else if (interval === 4) {
        return "major";
    }
    return "neither";
}

function getInterval(firstNote, secondNote){
    //returns the chromatic interval between two notes, assuming they are in ascending order (i.e. c to g is 7 semitones, but g to c is 5)
    let adjustment = 0;
    if (Math.abs(notes[firstNote] > notes[secondNote])){
        adjustment = 12;
    }
    return (notes[secondNote] + adjustment) - notes[firstNote];
};

function getNoteFromValue(value){
    //returns the first key from the "notes" object that has a value equal to the number provided.
    for (i=0;i<Object.values(notes).length;i++){
        if (Object.values(notes)[i] === value){
            return Object.keys(notes)[i];
        }
    }
}

function wrapNoteValue(positionNum){
    //our noteValue array begins at c: 1 and ends at b: 12. If we've over shot in either direction, we need to jump to the other end of the array.
    if (positionNum < 1) {
        positionNum = 12 + positionNum;
    }
    else if (positionNum > 12) {
        positionNum = positionNum - 12;
    }
    return positionNum;
}

function findShortestPathCircleOfFifths(distance){
    //if distance is greater than 6, then going the opposite direction will result in a shorter path, and a more correct brightness score.
    if (distance > 6 || distance < -6){
        return -Math.sign(distance)*(12 - Math.abs(distance));//*Lesson: Values, Data Types, and Operations*
    }
    return distance;
}

