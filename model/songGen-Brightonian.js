var Simple1dNoise = require('./Simple1dNoise');
const MusicalPattern = require('./MusicalPattern');
const Song = require('./song');
const Musician = require('./musician');
const TimeInterval = require('./timeInterval');
const MusicNote = require('./MusicNote');

const MELOD_IX = 0;
const CHORD_IX = 1;
const RYTHM_IX = 2;

module.exports = class SongGenerator {

  constructor() {

    this.MaxNotes = 12 * 4 *2;
    this.numPatterns = 0;
    this.numMelodyNotes = 0;
    this.genCount = 0;

    this.generator = new Simple1dNoise();
    this.generator.setScale(0.1);
    this.generator.setAmplitude(14);
  }

  getNoise(noteIndex) {
    //return Math.random() * 100;
    return this.generator.getVal(noteIndex); // * 100;
  }

  getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  create() {
    this.song = new Song();

    this.song.BandName = "Brightonian";
    this.song.Tempo = 110 + (Math.random() * 20); //BPM;
    this.song.Tempo = Math.floor(this.song.Tempo);
	  
    //this.song.KeyOffset = 0; //4;
    this.song.KeyOffset = this.getRand(0,8) -4;

    this.MaxTimeIntervals = 24 * 4 *2;

    this.numPatterns = 0;

    this.numMelodyTimeIntervals = 0;

    this.genCount = 0;

    this.generator = new Simple1dNoise();
    this.generator.setScale(0.1);

    this.createIdea();
    this.buildOnIdea();
  }

  createIdea() {

    console.log("Create a musical idea...");

    let ideaLen = 8;

    //Start with Middle C
    let pitch = 14 + this.song.KeyOffset;

    this.musicalIdea = new MusicalPattern();
    for(let i =0; i < ideaLen; i++) {

      this.musicalIdea.timeIntervals.push( new TimeInterval() );

      this.musicalIdea.timeIntervals[i].notes.push( 
        new MusicNote( 1, pitch + this.getRand(0,8), 1)
      );

      pitch++; 
    }

    console.log(this.musicalIdea.print());

    console.log(this);

    // Melody
    this.song.musicians.push( new Musician() );

    // Chords
    this.song.musicians.push( new Musician() );

    this.addToMelody(this.musicalIdea);
  }

  buildOnIdea() {

    console.log("Build the song...");

    // Rythm / drummer...
    this.song.musicians.push( new Musician() );

    let firstRythmPattern = this.createRythmFromMelody(this.musicalIdea);
    this.addToTrack(RYTHM_IX, firstRythmPattern);

    let firstChordsPattern = this.createChordsFromMelody(this.musicalIdea);
    this.addToTrack(CHORD_IX, firstChordsPattern);

    let nextMelodyPattern = this.developIdea(this.musicalIdea);
    let nextChordsPattern = this.createChordsFromMelody(nextMelodyPattern);
    let nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);

    for(let i = 0; this.song.musicians[MELOD_IX].timeIntervals.length < this.MaxTimeIntervals; i++) {

      this.addToMelody(nextMelodyPattern);
      this.addToTrack(CHORD_IX, nextChordsPattern);
      this.addToTrack(RYTHM_IX, nextRythmPattern);

      if(this.getRand(0,10) > 0) { 
        nextMelodyPattern = this.developIdea(this.musicalIdea);
      } else {
 	nextMelodyPattern = this.developIdea(nextMelodyPattern);
      }

      nextChordsPattern = this.createChordsFromMelody(nextMelodyPattern);
      nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);
    }
  }

  addToMelody(pattern) {

    console.log(pattern);
    console.log("Add to melody: " + pattern.print() );

    let track = this.song.musicians[MELOD_IX];

    let ival = track.timeIntervals.length -1;

    for(let i=0; i < pattern.timeIntervals.length && ival < this.MaxTimeIntervals -1; i++) {

      track.timeIntervals.push( new TimeInterval() );
      ival++;

      for(let j=0; j < pattern.timeIntervals[i].notes.length; j++) {
        track.timeIntervals[ival].notes.push( pattern.timeIntervals[i].notes[j].deepCopy() );
      }
    }
    if(track.timeIntervals.length == this.MaxTimeIntervals -1) {

      track.timeIntervals.push( new TimeInterval() );

      track.timeIntervals[ival].notes.push( 
        new Array(track.timeIntervals[0].notes[0].deepCopy())
      );
    }
  }

  addToTrack(trackIndex, pattern) {
    console.log("Add pattern to track ix " + trackIndex + " : " + pattern.print());
    let track = this.song.musicians[trackIndex]; 

    //set the tix to the end of the track...
    let tix = track.timeIntervals.length; // -1;

    //for each time interval in the pattern...
    console.log("pattern interval count:" + pattern.timeIntervals.length);
    console.log("total interval count:" + this.MaxTimeIntervals);

    for(let i=0; i < pattern.timeIntervals.length && tix+i < this.MaxTimeIntervals; i++) {

      //Add a new time interval to the track with the notes from the pattern...
      track.timeIntervals.push( new TimeInterval() );

      //copy each of the pattern notes in this interval...
      for(let j=0; j < pattern.timeIntervals[i].notes.length; j++) {
        track.timeIntervals[tix + i].notes.push(
          pattern.timeIntervals[i].notes[j].deepCopy()
        );
      }
    } 
    console.log(this.song.musicians[trackIndex]); 
  }

  createRythmFromMelody(pattern) {

    let rythmicalIdea = new MusicalPattern();

    let drums = [ 14, 15 ];

    let pause = false;

if(this.getRand(0,8) == 0) {
  console.log("pause drums");
  pause = true;
}

    for(let i=0; i < pattern.timeIntervals.length; i++) {

      rythmicalIdea.timeIntervals.push(new TimeInterval());

      //for(let j =0; j < pattern.timeIntervals[i].notes.length; i++) {

      let drum = 0;
      //switch(i%8) {
      switch((this.song.musicians[RYTHM_IX].timeIntervals.length + i)%8) {
        case 0:
          drum = drums[0];
          break;
	case 2:
	case 4:
	case 6:
	  drum = drums[1];
	  break;
      }

      rythmicalIdea.timeIntervals[i].notes.push(
	new MusicNote( 10, drum, drum == 0 || pause ? 0 :1 )
      );
    }

    return rythmicalIdea;
  }

  createChordsFromMelody(pattern) {

    let chordsIdea = new MusicalPattern();

    let pause = false;

if(this.getRand(0,8) == 0) {
  console.log("pause chords");
  pause = true;
}

    for(let i=0; i < pattern.timeIntervals.length; i++) {

      chordsIdea.timeIntervals.push(new TimeInterval());

      let drum = 0;
      switch(i%8) {
        case 0:
          drum = 1;
          break;
        default:
	  break;
      }

      let note = pattern.timeIntervals[i].notes[0];
      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.pitch, drum == 0 || pause ? 0 :4 ));
      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.pitch + 3, drum == 0 || pause ? 0 :4 ));
      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.pitch + 5, drum == 0 || pause ? 0 :4 ));
    }

    return chordsIdea;
  }


  developIdea(pattern){

    const MAX_PITCH = 28; //7*4
    const MIN_PITCH = 0;
		
    let newPattern;

    if(this.getRand(0,1) == 0) {
      newPattern = pattern.deepCopy();
    } else {
      newPattern = pattern.deepCopyInvert();
    }

    while(1) {

      let count  = Math.pow(2, this.getRand(0, 4));
      console.log("repeat " + count + " times");

      if(newPattern.timeIntervals.length > count) {

        //Remove any excess timeIntervals...

        while(newPattern.timeIntervals.length > count) { 

          newPattern.timeIntervals.pop();
        }
      } else if(newPattern.timeIntervals.length < count) {

        //Add some additional timeIntervals...

        let j = 0;
        while(newPattern.timeIntervals.length < count) {

          let newTimeInt = new TimeInterval();
          newTimeInt.notes.push( newPattern.timeIntervals[j].deepCopy() );

          newPattern.timeIntervals.push(newTimeInt);
          j++;

          if(j == newPattern.timeIntervals.length) {
            j=0;
          }	
        }
      }

      //foreach timeInterval adjust the notes...

      for(let i=0; i < newPattern.timeIntervals.length; i++) {

        let oldTimeInterval = newPattern.timeIntervals[i].deepCopy();

        //dont always change the pitch...
        //if(false) {
        if(this.getRand(0,20) == 0) {

          let randomAdjustment = Math.floor(this.getNoise(this.numMelodyNotes +i )) -7;
          //let randomAdjustment = this.getRand(-7, 7);

          console.log("random adjustment: " + randomAdjustment);

	  //foreach note make a random pitch adjustment...
	  for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {

            newPattern.timeIntervals[i].notes[j].pitch += randomAdjustment;

            if(newPattern.timeIntervals[i].notes[j].pitch > MAX_PITCH) {
              console.log("pitch too high!");
              newPattern.timeIntervals[i].notes[j].pitch = MAX_PITCH;
            }

            if(newPattern.timeIntervals[i].notes[j].pitch < MIN_PITCH) {
              console.log("pitch too low!");
              newPattern.timeIntervals[i].notes[j].pitch = MIN_PITCH;
            }
          }
        }

        for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {

          newPattern.timeIntervals[i].notes[j].sustain = 2;
        }

        //dont always change the sustain, dont let the last note last too long...
        if(this.getRand(0,4) ==0  && i < newPattern.timeIntervals.length -1) {

          let randomSustain = this.getRand(1, 4);

          for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {
            newPattern.timeIntervals[i].notes[j].sustain = randomSustain;
          }
        }

        //dont always play a note...
        if(this.getRand(0,5) == 0) {

          for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {
            newPattern.timeIntervals[i].notes[j].sustain = 0;
          }
        }

        //Check the previous note and if its a long one then turn this one off...
        if(i > 0 && newPattern.timeIntervals[i-1].notes[0].sustain > 1) {

          for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {

            newPattern.timeIntervals[i].notes[j].sustain = 0;
          }
        }

      }

//randomly change some stuff based on some factors - positionInSong, tension
//Mutations:
//question / answer,
//peaks / troughs;
//tension + resolving
//create tension towards the beginning
//resolve towards the end.

 //...then qualiy control with AI / tensorflow..
      if(1 > 0.8) {
	break;
      }
    }

    return newPattern;
  }
}

