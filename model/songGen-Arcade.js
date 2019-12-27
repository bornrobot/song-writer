
class SongGenerator {

	constructor() {
/*
		this.song = new Song();

		this.song.BandName = "Arcade";
		this.song.Tempo = 100 + (Math.random() * 20); //BPM;
		this.song.KeyOffset = 0; //4;
*/

		this.MaxNotes = 12 * 4 *2;
		this.numPatterns = 0;
		this.numMelodyNotes = 0;
		this.genCount = 0;

		this.generator = new Simple1DNoise();
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

		this.song.BandName = "Arcade";
		this.song.Tempo = 100 + (Math.random() * 20); //BPM;
		//this.song.KeyOffset = 0; //4;
		this.song.KeyOffset = this.getRand(0,8) -4;

		this.MaxNotes = 12 * 4 *2;
		this.numPatterns = 0;
		this.numMelodyNotes = 0;
		this.genCount = 0;

		this.generator = new Simple1DNoise();
		this.generator.setScale(0.1);

		this.createIdea();
		this.buildOnIdea();
	}

        createIdea() {

		console.log("Create a musical idea...");

		let ideaLength = 8;

		//Start wiht Middle C
		let pitch = 14 + this.song.KeyOffset;

		let idea = new Array();
		for(let i =0; i < ideaLength; i++) {

			idea.push(
				new MusicNote( 1, pitch + this.getRand(0,8), 1)
			);
			pitch++; 
		}

		this.musicalIdea = new MusicalPattern(idea);

		console.log(this.musicalIdea.print());
		$("#span-musicalIdea").text(this.musicalIdea.print());

		this.addToMelody( this.musicalIdea );
	}

	buildOnIdea() {

		console.log("Build the song...");

		let firstRythmPattern = this.createRythmFromMelody(this.musicalIdea);
		this.addToRythm(firstRythmPattern);

		let nextMelodyPattern = this.developIdea(this.musicalIdea);
		let nextRythmPattern = 	this.createRythmFromMelody(nextMelodyPattern);

		for(let i = 0; this.song.melody.length < this.MaxNotes; i++) {

			this.addToMelody(nextMelodyPattern);
			this.addToRythm(nextRythmPattern);

			if(this.getRand(0,1) == 0) { 
				nextMelodyPattern = this.developIdea(this.musicalIdea);
			} else {
				nextMelodyPattern = this.developIdea(nextMelodyPattern);
			}
			nextRythmPattern = this.createRythmFromMelody(nextMelodyPattern);
		}

		$("#span-song").text("");
		for(let j=0; j < this.song.melody.length; j++){
			$("#span-song").append(this.song.melody[j].print());
		}
	}

	addToMelody(pattern) {

		console.log("Add to melody: " + pattern.print());

		for(let i =0; i < pattern.notes.length && this.song.melody.length < this.MaxNotes -1; i++) {
			this.song.melody.push(pattern.notes[i].deepCopy());
		}

		if(this.song.melody.length == this.MaxNotes -1) {
			this.song.melody.push(this.song.melody[0].deepCopy());
		}

		this.numMelodyNotes += pattern.notes.length;
	}

	addToRythm(pattern) {

		console.log("Add to rythm: " + pattern.print());

		for(let i =0; i < pattern.notes.length && this.song.rythm.length < this.MaxNotes; i++) {
			this.song.rythm.push(pattern.notes[i].deepCopy());
		}

		this.patternIndex++;
	}

	createRythmFromMelody(pattern) {

		let rythmicalIdea = new Array();

		let drums = [ 14, 15 ];

		let pause = false;
		if(this.getRand(0,8) == 0) {
			console.log("pause drums");
			pause = true;
		}

		for(let i =0; i < pattern.notes.length; i++) {

			let drum = 0;
			//switch(i%8) {
			switch((this.song.rythm.length + i)%8) {
				case 0:
					drum = drums[0];
			 		break;
				case 2:
				case 4:
				case 6:
					drum = drums[1];
				break;
			}

			rythmicalIdea.push(
				new MusicNote( 10, drum, drum == 0 || pause ? 0 :1 )
			);
		}
		return new MusicalPattern(rythmicalIdea);
	}

	developIdea(pattern){

		const MAX_PITCH = 28; //7*4
		const MIN_PITCH = 0;

		
		let newPattern;
		if(this.getRand(0,1) == 0)  {
		 	newPattern = pattern.deepCopy();
		} else {
			newPattern = pattern.deepCopyInvert();
		}

		while(1) {

			let count  = Math.pow(2, this.getRand(0, 4));
			console.log("repeat " + count + " times");

			if(newPattern.notes.length > count) {
				while(newPattern.notes.length > count) { 
					newPattern.notes.pop();
				}
			} else if(newPattern.notes.length < count) {
				let j = 0;
				while(newPattern.notes.length < count) {
					newPattern.notes.push(newPattern.notes[j].deepCopy());

					j++;
					if(j == newPattern.notes.length) {
						j = 0;
					}	
				}
			}

			for(let i = 0; i < newPattern.notes.length; i++) {

				let oldNote = newPattern.notes[i].deepCopy();

				//dont always change the pitch...
				//if(false) {
				if(this.getRand(0,8) == 0) {

					let randomAdjustment = Math.floor(this.getNoise(this.numMelodyNotes +i )) -7;
					//let randomAdjustment = this.getRand(-7, 7);

					console.log("random adjustment: " + randomAdjustment);

					newPattern.notes[i].pitch += randomAdjustment;

					if(newPattern.notes[i].pitch > MAX_PITCH) {
						console.log("pitch too high!");
						newPattern.notes[i].pitch = MAX_PITCH;
					}
					if(newPattern.notes[i].pitch < MIN_PITCH) {
						console.log("pitch too low!");
						newPattern.notes[i].pitch = MIN_PITCH;
					}
				}

				newPattern.notes[i].sustain = 2;

				//dont always change the sustain, dont let the last note last too long...
				if(this.getRand(0,4) ==0  && i < newPattern.notes.length -1) {

					let randomSustain = this.getRand(1, 4);

					newPattern.notes[i].sustain = randomSustain;
				}

				//dont always play a note...
				if(this.getRand(0,10) == 0) {
					newPattern.notes[i].sustain = 0;
				}

				//Check the previous note and if its a long one then turn this one off...
				if(i > 0 && newPattern.notes[i -1].sustain > 1) {
					newPattern.notes[i].sustain = 0;
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

