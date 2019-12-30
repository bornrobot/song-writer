var Simple1dNoise = require('./Simple1dNoise');
const MusicalPattern = require('./MusicalPattern');
const Song = require('./song');
const Musician = require('./musician');
const TimeInterval = require('./timeInterval');
const MusicNote = require('./MusicNote');

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

    //Start wiht Middle C
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

    this.song.musicians.push( new Musician() );

    this.addToMelody(this.musicalIdea);
  }

  buildOnIdea() {

    console.log("Build the song...");

    //add rythm...
    this.song.musicians.push( new Musician() );

    let firstRythmPattern = this.createRythmFromMelody(this.musicalIdea);
    this.addToRythm(firstRythmPattern);

    let nextMelodyPattern = this.developIdea(this.musicalIdea);
    let nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);

    for(let i = 0; this.song.musicians[0].timeIntervals.length < this.MaxTimeIntervals; i++) {

      this.addToMelody(nextMelodyPattern);
      this.addToRythm(nextRythmPattern);

      if(this.getRand(0,10) > 0) { 
        nextMelodyPattern = this.developIdea(this.musicalIdea);
      } else {
 	nextMelodyPattern = this.developIdea(nextMelodyPattern);
      }
      nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);
    }
  }

  addToMelody(pattern) {

    console.log(pattern);
    console.log("Add to melody: " + pattern.print() );

    //let musician = this.song.musicians[0];

    let ival = this.song.musicians[0].timeIntervals.length -1;

    for(let i=0; i < pattern.timeIntervals.length && ival < this.MaxTimeIntervals -1; i++) {

      this.song.musicians[0].timeIntervals.push( new TimeInterval() );
      ival++;

      for(let j=0; j < pattern.timeIntervals[i].notes.length; j++) {
        this.song.musicians[0].timeIntervals[ival].notes.push( pattern.timeIntervals[i].notes[j].deepCopy() );
      }
    }
    if(this.song.musicians[0].timeIntervals.length == this.MaxTimeIntervals -1) {

      this.song.musicians[0].timeIntervals.push( new TimeInterval() );

      this.song.musicians[0].timeIntervals[ival].notes.push( 
        new Array(this.song.musicians[0].timeIntervals[0].notes[0].deepCopy())
      );
    }
  }

  addToRythm(pattern) {

    console.log("Add to rythm: " + pattern.print());

    let ival = this.song.musicians[1].timeIntervals.length -1;
    
    for(let i=0; i < pattern.timeIntervals[i].length && ival < this.MaxTimeIntervals; i++) {

      this.song.musicians[1].timeIntervals.push( new TimeInterval() );
      ival++;

      for(let j=0; j < pattern.timeIntervals[i].notes.length; j++) {

        this.song.musicians[1].timeIntervals[ival].notes.push(
          pattern.timeIntervals[i].notes[j].deepCopy());
      }
    } 

    this.patternIndex++;
  }

  createRythmFromMelody(pattern) {

    let rythmicalIdea = new MusicalPattern();

    let drums = [ 14, 15 ];

    let pause = false;

/*
if(this.getRand(0,8) == 0) {
  console.log("pause drums");
  pause = true;
}
*/

    for(let i=0; i < pattern.timeIntervals.length; i++) {

      rythmicalIdea.timeIntervals.push(new TimeInterval());

      //for(let j =0; j < pattern.timeIntervals[i].notes.length; i++) {

      let drum = 0;
      //switch(i%8) {
      switch((this.song.musicians[1].timeIntervals.length + i)%8) {
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

