
module.exports = class MusicalPattern {

  constructor() {

    this.ticks = new Array();
  }

  deepCopy() {

    let copy = new MusicalPattern();

    for(let i=0; i < this.ticks.length; i++) {

      copy.ticks.push(this.ticks[i].deepCopy());
    }

    return copy;
  }

  deepCopyInvert() {

    let copy = new MusicalPattern();

    for(let i=this.ticks[i].length; i > 0; i--) {

      copy.ticks.push(this.ticks[i-1].deepCopy());
    }

    return copy;
  }

  print() {

    let str = "";

    for(let i=0; i < this.ticks.length; i++) {

      str += this.ticks[i].print();
    }

    return str;
  }
}

