const MIDI_C4 = 72;
const MAX_POFF = 7*4;
const MIN_POFF = 7*-4;
const MAX_PITCH = 127;
const MIN_PITCH = 0;

module.exports = class MusicNote {

  //Diatonic Pitch = Diatonic offset from the root note, (0-6 + octive offset).
  //Chromatic Pitch = Chromatic offset from the root note, (0-11 + octive offset).

  constructor(instr, keyoff, poff, pitch, sus) { 

    this.channel = instr;
    this.poff = poff; //diatonic pitch offset;
    this.keyoff = keyoff;

    if(pitch > -1) {
      this.pitch = pitch;
    } else {
      this.pitch = this.getMidiPitch();
    }

    this.velocity = 127;
    this.sustain = sus; // 0 = off
  }

  adjustPoff(i) {

    let newPoff = this.poff + i;

    if(newPoff > MAX_POFF) {
      console.log("poff too high!");
      newPoff = MAX_POFF;
    }

    if(newPoff < MIN_POFF) {
      console.log("poff too low!");
      newPoff = MIN_POFF;
    }

    this.poff = newPoff;
    this.pitch = this.getMidiPitch();
  }

  getChromaticPitchFromMajorDiatonicPitch()
  {
    const chromMap = [ 0, 2, 4, 5, 7, 9, 11 ];

    let octoff = Math.floor(this.poff / 7);
    let diatPitch = this.poff % 7;

    //Make sure diatonic pitch is positive...
    if(diatPitch < 0) {
      diatPitch += 7; 
    }
 
    return chromMap[diatPitch] + (octoff * 12);
  }

  getMidiPitch()
  {
    let cpoff = this.getChromaticPitchFromMajorDiatonicPitch();

    let pitch = MIDI_C4 + this.keyoff + cpoff;

    if(pitch > MAX_PITCH) {
      console.log("pitch " + pitch + " too high!");
      pitch = MAX_PITCH;
    } 

    if(pitch < MIN_PITCH) {
      console.log("pitch " + pitch + " too low!");
      pitch = MIN_PITCH;
    }

    console.log("p: " + pitch + " from poff:" + this.poff + " key:" + this.keyoff + " cpoff:" + cpoff);

    return pitch;
  }

  getOctave() {
    return Math.floor(this.pitch / 12) -1;
  }

  getNote() {

    const notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];	

    let coff = (this.pitch) % 12;
   
    return notes[coff] + this.getOctave();
  }

  deepCopy() {
    let copy = new MusicNote(this.channel, this.keyoff, this.poff, this.pitch, this.sustain);
    return copy;
  }

  print() {
    var str = ".";
    return JSON.stringify(this) + "\n";
    //return (this.sustain == 0 ? "x" : this.getNote()) + str.repeat(this.sustain);
  }
}

