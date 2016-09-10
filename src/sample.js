;(function(noisy){
	"use strict";

	var Sample = noisy.Sample = function( args ) {
		this._constructor();
		args = args || {};

		if (!Noisy.is(args.data,Uint8Array)) throw new Error("[Uint8Array data] must be provided when creating a Noisy.Sample object");
		if (!Noisy.is(args.time,'number')) throw new Error("[int time] must be provided when creating a Noisy.Sample object");
		if (!Noisy.is(args.frames,'number')) throw new Error("[int frames] must be provided when creating a Noisy.Sample object");
		if (args.frames !== args.data.length/Noisy.fftSize) throw new Error("[int frames] must match the Noisy.fftSize ratio to data length");

		this.name   = args.name||this.id;
		this.label  = args.label||null;
		this.data   = args.data;
		this.time   = args.time;
		this.frames = args.frames;
		
	};

	Sample.prototype.save = function() {
		var self = this;
		//sample.save( localStorage );
	};

	Sample.prototype.load = function() {
		var self = this;
		//sample.load( "http://example.com/sound.mp3" );
		//   OR
		//sample.load( Uint8Array )
	};

	Sample.prototype.destroy = function() {
		var self = this;
		//delete from storage to free space
	};
	
	noisy.register(Sample);

})(this.Noisy);