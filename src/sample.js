;(function(noisy){
	"use strict";

	var Sample = noisy.Sample = function( args ) { 
		this._constructor();
		this.name = args.name||this.id;
		this.label = args.label||null;
	};

	Sample.prototype.allocate = function( milliseconds ) {
		var self = this;
		self.length = milliseconds;
		//sample.allocate( 1000 );
	};

	Sample.prototype.record = function() {
		var self = this;
		//sample.record( );

	};

	Sample.prototype.save = function() {
		var self = this;
		//sample.save( localStorage );

	};

	Sample.prototype.load = function() {
		var self = this;
		//sample.load( "http://example.com/sound.mp3" );
		//   OR
		//sample.load( UInt8Array )
	};

	Sample.prototype.destroy = function() {
		var self = this;
	};
	
	noisy.register(Sample);

})(this.Noisy);