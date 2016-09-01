;(function(global){
	"use strict";

	var _id = function() {
		//Gets a random id:
		return Math.floor(Math.random() * (1e16-500000) + 500000);
	};

	var _is = function( obj , type ) {
		return (obj instanceof type);
	};

	var _constructor = function() {
		return function() {
			this.id = _id();
		}
	};

	//Noisy constructor
	var Noisy = global.Noisy = function() { 
		this._constructor();
		this._listeners={};
		this._models={};
	};

	//Listener callback from microphone
	Noisy.prototype._listen = function(data) {
		console.log(data);
	};

	//Add event listener
	Noisy.prototype.on = function( label , model , callback) {
		var self = this;
		if ( ! _is( model , Noisy.Model) ) throw new Error("Model must be provided");

		self._models[model.id] = self._models[model.id] || model;
		self._listeners[label] = self._listeners[label] || [];
		self._listeners[label].push({
			label:label,
			model:model.id,
			callback:callback
		});
	};

	//Start listening to the mic
	Noisy.prototype.listen = function() {
		var self = this;
		Noisy.Mic( self._listen );
	};

	//Global static module methods
	Noisy.register = function( obj ){
		obj.prototype._constructor = _constructor();
	};

	Noisy.register(Noisy);

})(this);