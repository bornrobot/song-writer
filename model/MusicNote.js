
module.exports = class MusicNote {

  constructor(instr, pitch, sus) {
    this.channel = instr;
    this.pitch = pitch; 
    this.velocity = 127;
    this.sustain = sus; // 0 = off
  }

  getOctave() {
    let oct = 0
    if(this.pitch > 0 || this.pitch < 0) {
      oct = Math.floor(this.pitch / 7);
    }
    return oct +2;
  }

  getNote() {

    let note = (this.pitch) % 7;

    switch(note) {
      case 1:
	note += 1;
        break;

      case 2: 
      case 3:
        note += 2;
        break;

      case 4:
        note += 3;
        break;

      case 5:
        note+= 4;
        break;

      case 6:
        note += 5;
        break;
    }

    const notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];	

    return notes[note] + this.getOctave();
  }

  deepCopy() {
    let copy = new MusicNote(this.channel, this.pitch, this.sustain);
    return copy;
  }

  print() {
    var str = ".";
    return (this.sustain == 0 ? "x" : this.getNote()) + str.repeat(this.sustain);
  }
}

