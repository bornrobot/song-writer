module.exports = class Simple1DNoise {

	constructor() {
	    this.MAX_VERTICES = 256;
	    this.MAX_VERTICES_MASK = this.MAX_VERTICES -1;
	    this.amplitude = 1;
	    this.scale = 1;

	    this.r = [];

	    for (let i = 0; i < this.MAX_VERTICES; ++i ) {
		this.r.push(Math.random());
	    }
	}

	setAmplitude(newAmplitude) {
		this.amplitude =newAmplitude;
	}

    setScale(newScale) {
        this.scale = newScale;
    }

    getVal( x ) {

        let scaledX = x * this.scale;
		let xFloor = Math.floor(scaledX);

		console.log(scaledX);

		var t = scaledX - xFloor;
		var tRemapSmoothstep = t * t * ( 3 - 2 * t );

		var xMin = xFloor % this.MAX_VERTICES_MASK;
		var xMax = ( xMin + 1 ) % this.MAX_VERTICES_MASK;

		var y = this.lerp( this.r[ xMin ], this.r[ xMax ], tRemapSmoothstep );

        return y * this.amplitude;
    }

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    lerp(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    }

}
