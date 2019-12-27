
module.exports = class MusicalPattern {

  constructor() {

    this.timeIntervals = new Array();
  }

  deepCopy() {

    let copy = new MusicalPattern();

    for(let i=0; i < this.timeIntervals.length; i++) {

      copy.timeIntervals.push(this.timeIntervals[i].deepCopy());
    }

    return copy;
  }

  deepCopyInvert() {

    let copy = new MusicalPattern();

    for(let i=this.timeIntervals[i].length; i > 0; i--) {

      copy.timeIntervals.push(this.timeIntervals[i-1].deepCopy());
    }

    return copy;
  }

  print() {

    let str = "";

    for(let i=0; i < this.timeIntervals.length; i++) {

      str += this.timeIntervals[i].print();
    }

    return str;
  }
}

