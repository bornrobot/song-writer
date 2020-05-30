var Simple1dNoise = require('./Simple1dNoise');
const MusicalPattern = require('./MusicalPattern');
const Song = require('./song');
const Musician = require('./musician');
const Tick = require('./tick');
const MusicNote = require('./MusicNote');

const MELOD_IX = 0;
const CHORD_IX = 1;
const RYTHM_IX = 2;

const MIDI_KICK_DRUM = 60;
const MIDI_HIHAT = 71;
const MIDI_SNARE = 62;

const MAX_TICKS = 24;

module.exports = class SongGenerator {

  constructor() {
  }

  create() {
    this.song = new Song();
    this.song.BandName = "Test";
    this.song.Tempo = 80; //BPM;
	  
    // { -6 ... +6 } //semi-tone offset from C4
    this.song.KeyOffset = -6;

    this.ticks = 0;

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

      this.musicalIdea.ticks.push( new Tick() );

      this.musicalIdea.ticks[i].notes.push( 
        new MusicNote( 1, this.song.KeyOffset, poff, -1, 1)
      );

      //Adjust the pitch by some amount...
      poff = poff+1;
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

    for(let i = 0; this.song.musicians[MELOD_IX].ticks.length < MAX_TICKS; i++) {

      this.addToMelody(nextMelodyPattern);
      this.addToTrack(CHORD_IX, nextChordsPattern);
      this.addToTrack(RYTHM_IX, nextRythmPattern);

      nextMelodyPattern = this.developIdea(nextMelodyPattern);

      nextChordsPattern = this.createChordsFromMelody(nextMelodyPattern);
      nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);
    }
  }

  addToMelody(pattern) {

    console.log(pattern);
    console.log("Add to melody: " + pattern.print() );

    let track = this.song.musicians[MELOD_IX];

    let ival = track.ticks.length -1;

    for(let i=0; i < pattern.ticks.length && ival < MAX_TICKS -1; i++) {

      track.ticks.push( new Tick() );
      ival++;

      for(let j=0; j < pattern.ticks[i].notes.length; j++) {
        track.ticks[ival].notes.push( pattern.ticks[i].notes[j].deepCopy() );
      }

      this.ticks++;
    }

    if(track.ticks.length == MAX_TICKS -1) {

      track.ticks.push( new Tick() );

      track.ticks[ival].notes.push( 
        new Array(track.ticks[0].notes[0].deepCopy())
      );
    }
  }

  addToTrack(trackIndex, pattern) {
    console.log("Add pattern to track ix " + trackIndex + " : " + pattern.print());
    let track = this.song.musicians[trackIndex]; 

    //set the tix to the end of the track...
    let tix = track.ticks.length; // -1;

    //for each time interval in the pattern...
    console.log("pattern interval count:" + pattern.ticks.length);
    console.log("total interval count:" + MAX_TICKS);

    for(let i=0; i < pattern.ticks.length && tix+i < MAX_TICKS; i++) {

      //Add a new time interval to the track with the notes from the pattern...
      track.ticks.push( new Tick() );

      //copy each of the pattern notes in this interval...
      for(let j=0; j < pattern.ticks[i].notes.length; j++) {
        track.ticks[tix + i].notes.push(
          pattern.ticks[i].notes[j].deepCopy()
        );
      }
    } 
    console.log(this.song.musicians[trackIndex]); 
  }

  createRythmFromMelody(pattern) {

    let rythmicalIdea = new MusicalPattern();

    let pause = false;

    for(let i=0; i < pattern.ticks.length; i++) {

      rythmicalIdea.ticks.push(new Tick());

      let drum = 0;

      let p = (this.song.musicians[RYTHM_IX].ticks.length + i)%8;

      if(p%4 == 0) {
          rythmicalIdea.ticks[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_KICK_DRUM, pause ? 0 :1 )
          );
      }

      if(p%4 == 2) {
          rythmicalIdea.ticks[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_SNARE, pause ? 0 :1 )
          );
      }

      if(p%2 == 0) {
          rythmicalIdea.ticks[i].notes.push(
	    new MusicNote( 10, -1, -1, MIDI_HIHAT, pause ? 0 :1 )
          );
      }
    }

    return rythmicalIdea;
  }

  createChordsFromMelody(pattern) {

    let chordsIdea = new MusicalPattern();

    let paused = false;
    let sus = 1;

    for(let i=0; i < pattern.ticks.length; i++) {

      chordsIdea.ticks.push(new Tick());

      let note = pattern.ticks[i].notes[0];

      //chordsIdea.ticks[i].notes.push( new MusicNote( 2, note.keyoff, note.poff, -1, sus ));
      //chordsIdea.ticks[i].notes.push( new MusicNote( 2, note.keyoff, note.poff + 2, -1, sus ));
      chordsIdea.ticks[i].notes.push( new MusicNote( 2, note.keyoff, note.poff + 4, -1, sus ));
    }

    return chordsIdea;
  }

  developIdea(pattern){

    console.log("developing pattern...");

    let newPattern;

    newPattern = pattern.deepCopy();

      for(let i=0; i < newPattern.ticks.length; i++) {

	  for(let j=0; j < newPattern.ticks[i].notes.length; j++) {

            newPattern.ticks[i].notes[j].adjustPoff(7);
          }
      }

    return newPattern;
  }
}

