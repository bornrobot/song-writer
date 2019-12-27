
module.exports = class Song {

  constructor() {

    this.BandName = "Unknown";
    this.Tempo = 100;
    this.KeyOffset = 0;

/* 
   TODO: Replace these 2 arrays with multi-dimensional arrays 
   to allow for many instruments and many notes per instrument per beat. 
   this.notes = notes[instruments][beat][notes]
*/

    this.musicians = new Array();

    this.melody = new Array();
    this.rythm = new Array();

    console.log(this);
  }
}

