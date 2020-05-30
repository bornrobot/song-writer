var Simple1dNoise = require('./Simple1dNoise');
const MusicalPattern = require('./MusicalPattern');
const Song = require('./song');
const Musician = require('./musician');
const TimeInterval = require('./timeInterval');
const MusicNote = require('./MusicNote');

const MELOD_IX = 0;
const CHORD_IX = 1;
const RYTHM_IX = 2;

const MIDI_KICK_DRUM = 60;
const MIDI_HIHAT = 71;
const MIDI_SNARE = 62;

const MAX_TICKS = 24 * 4 *2;

module.exports = class SongGenerator {

  constructor() {
  }

  getNoise(tick) {
    return Math.floor(this.generator.getVal(tick));
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
	  
    // { -6 ... +6 } //semi-tone offset from C4
    this.song.KeyOffset = this.getRand(0,12) -6;

    this.ticks = 0;

    this.generator = new Simple1dNoise();
    this.generator.setScale(1);
    this.generator.setAmplitude(14);

    this.createIdea();
    this.buildOnIdea();
  }

  createIdea() {

    console.log("Create a musical idea...");

    let ideaLen = 8;

    //Start with Middle C
    let poff = 0;

    this.musicalIdea = new MusicalPattern();
    for(let i =0; i < ideaLen; i++) {

      this.musicalIdea.timeIntervals.push( new TimeInterval() );

      this.musicalIdea.timeIntervals[i].notes.push( 
        new MusicNote( 1, this.song.KeyOffset, poff, -1, 1)
      );

      //Adjust the pitch by some amount...
      poff = Math.floor(this.getNoise(i));
    }

    console.log("Musical idea:");
    console.log(this.musicalIdea.print());

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

    for(let i = 0; this.song.musicians[MELOD_IX].timeIntervals.length < MAX_TICKS; i++) {

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

    for(let i=0; i < pattern.timeIntervals.length && ival < MAX_TICKS -1; i++) {

      track.timeIntervals.push( new TimeInterval() );
      ival++;

      for(let j=0; j < pattern.timeIntervals[i].notes.length; j++) {
        track.timeIntervals[ival].notes.push( pattern.timeIntervals[i].notes[j].deepCopy() );
      }

      this.ticks++;
    }

    if(track.timeIntervals.length == MAX_TICKS -1) {

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
    console.log("total interval count:" + MAX_TICKS);

    for(let i=0; i < pattern.timeIntervals.length && tix+i < MAX_TICKS; i++) {

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

    let pause = false;


    if(this.getRand(0,8) == 0) {
      console.log("pause drums");
      pause = true;
    }

    for(let i=0; i < pattern.timeIntervals.length; i++) {

      rythmicalIdea.timeIntervals.push(new TimeInterval());

      let drum = 0;

      let p = (this.song.musicians[RYTHM_IX].timeIntervals.length + i)%8;

      if(p%4 == 0) {
          rythmicalIdea.timeIntervals[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_KICK_DRUM, pause ? 0 :1 )
          );
      }

      if(p%4 == 2) {
          rythmicalIdea.timeIntervals[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_SNARE, pause ? 0 :1 )
          );
      }

      if(p%2 == 0) {
          rythmicalIdea.timeIntervals[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_HIHAT, pause ? 0 :1 )
          );
      }
    }

    return rythmicalIdea;
  }

  createChordsFromMelody(pattern) {

    let chordsIdea = new MusicalPattern();

    let paused = false;
    let sus = 0;

    if(this.getRand(0,8) == 0) {
      console.log("pause chords");
      paused = true;
    }

    for(let i=0; i < pattern.timeIntervals.length; i++) {

      chordsIdea.timeIntervals.push(new TimeInterval());

      if(!paused && i%8 == 0) {
        sus = 4;
      } else {
        sus = 0;
      }

      let note = pattern.timeIntervals[i].notes[0];

      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.keyoff, note.poff, -1, sus ));
      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.keyoff, note.poff + 2, -1, sus ));
      chordsIdea.timeIntervals[i].notes.push( new MusicNote( 2, note.keyoff, note.poff + 4, -1, sus ));
    }

    return chordsIdea;
  }

  developIdea(pattern){

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

        if(1) { //if(this.getRand(0,20) == 0) {

          let rand = this.getNoise(this.ticks + i);

          console.log("perlin noise rand: " + rand + "\n");

          let randomAdjustment = rand - 7;

          console.log("random adjustment: " + randomAdjustment);

	  //Make a random pitch adjustment...
	  for(let j=0; j < newPattern.timeIntervals[i].notes.length; j++) {

            console.log("is this a note?");
            console.log(newPattern.timeIntervals[i].notes[j]);

            newPattern.timeIntervals[i].notes[j].adjustPoff(randomAdjustment);
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

