;(function(noisy){
	"use strict";

	var Model = noisy.Model = function( args ) { 
		this._constructor();
		this.name = args.name||this.id;
	};

	Model.prototype.save = function() {
		var self = this;
		//model.save( localStorage );
	};

	Model.prototype.load = function() {
		var self = this;
		//model.load( "http://example.com/model.blob" );
		//   OR
		//model.load( UInt8Array )
	};

	Model.prototype.train = function( sample ) {
		var self = this;
		//model.train( sample );
	};

	Model.prototype.classify = function( sample , callback ) {
		var self = this;
		//model.classify( sample );
	};

	noisy.register(Model);

})(this.Noisy);