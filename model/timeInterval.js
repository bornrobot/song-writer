module.exports = class TimeInterval {

  constructor() {

    this.notes = new Array();

  }

  deepCopy() {

    let copy = new TimeInterval();

    for(let i=0; i < this.notes.length; i++) {

      copy.notes.push( this.notes[i].deepCopy() );
    }

    return copy;
  }

  print() {

    let str = "";

    for(let i=0; i < this.notes.length; i++) {
        str += this.notes[i].print();
    }

    return str;
  }
}
