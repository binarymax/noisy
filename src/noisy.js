;(function(global){
	"use strict";

	if (global.Noisy) return false;

	//-----------------------------------------------------------
	var _id = function() {
		//Gets a random id:
		return '__noisy_' + Math.floor(Math.random() * (1e16-500000) + 500000);
	};

	var _is = function( obj , type ) {
		//Checks if obj matches the type
		return ((obj instanceof type) || (typeof obj === type));
	};

	var _constructor = function() {
		//Common constructor for all Noisy modules
		return function() {
			this.id = _id();
		}
	};

	//-----------------------------------------------------------
	//Noisy constructor
	var Noisy = global.Noisy = function( args ) { 
		this._constructor();
		this._listeners={};
		this._models={};

		args = args || {};

		this.tolerance = args.tolerance || 20;
		this.threshold = args.threshold || 200;
		this.limit = args.limit || 200;

		this.gap = 0;
		this.last = 0;

		this.data = [];
		this.time = 0;
		this.frame = 0;
		this.capture = false;

		Noisy.Mic( self._listen );

	};

	Noisy.prototype._listen = function( freqdata , timedata ) {
		var self = this;
		if (self.capture) {
			
			var gap = false;

			var tol = 0;
			var lim = false;

			var now = (new Date()) - 0;
			var buf = new Uint8Array( Noisy.fftSize );
			
			//Copy the data to a buffer, and tally for gap check
			for(var x=0; x<Noisy.fftSize; x+=2) {
				buf[x  ] = freqdata[x];
				buf[x+1] = timedata[x];

				if (buf[x  ]>self.tolerance) tol++;
				if (buf[x  ]>self.limit) lim = true;
				if (buf[x+1]>self.tolerance) tol++;
				if (buf[x+1]>self.limit) lim = true;

			}

			//Add the data to the stream
			if (!lim && tol < self.threshold) gap = true;
			self.time = now - self.started;
			self.data.push({buffer:buf,time:self.time,gap:gap});
			self.frame++;

			if (gap && self.time>1 && !self.data[self.frame-2].gap) {
				//New gap found, create sample and let Noisy know
				var blocks = self.frame - self.last;
				var octets = new Uint8Array( Noisy.fftSize * blocks );
				for (var y = self.last; y<self.frame; y++) {
					for(var x=0; x<Noisy.fftSize; x++) {
						octets[x] = self.data[y].buffer[x];
					};
				};
				var time = self.data[self.frame-1].time - self.data[self.last].time;
				var sample = new Noisy.Sample( {data:octets,time:time,frames:self.frame-self.last} );
				self.last = self.frame - 1;

				//Tell noisy about the sample:
				self.trigger("sample",sample);

			}
			
		};
	};

	Noisy.prototype.classify = function(data) {
		var self = this;
		for(var m in self._models) {
			var model = self._models[m];
			if(_is(model,Noisy.Model)) {
				var results = self._models[m].classify(data);
				for(var i=0;i<results.length;i++) {
					self._listeners[results[i]].callback(results[i]);
				}
			}
		}
	};

	Noisy.prototype.trigger = function( event , data ) {
		var self = this;
		if (event === "sample" && !data.label) {
			self.classify(data);
		};
	};

	Noisy.prototype.start = function() {
		var self = this;
		
		self.gap = 0;
		self.last = 0;

		self.capture = true;
		self.started = (new Date()) - 0;
	};

	Noisy.prototype.stop = function() {
		var self = this;
		self.capture = false;
	};

	Noisy.prototype.clear = function() {
		var self = this;
		self.stop();

		delete self.data;
		self.gap = 0;
		self.last = 0;
		self.data = [];
		self.time = 0;
		self.frame = 0;
	};


	//Add label event listener
	Noisy.prototype.on = function( label , model , callback) {
		var self = this;
		if ( ! _is( model , Noisy.Model ) ) throw new Error("Model must be provided");

		self._models[model.id] = self._models[model.id] || model;
		self._listeners[label] = self._listeners[label] || [];
		self._listeners[label].push({
			label:label,
			model:model.id,
			callback:callback
		});
	};

	//-----------------------------------------------------------
	//Global static module methods
	Noisy.register = function( obj ){
		obj.prototype._constructor = _constructor();
	};

	Noisy.id = _id;
	Noisy.is = _is;

	Noisy.register(Noisy);

})(this);

//https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/CNN_ASLPTrans2-14.pdf

//https://www.microsoft.com/en-us/research/wp-content/uploads/2015/04/Detailed-Analysis-of-Convolutional-Neural-Networks-for-Speech-Recognitio_Final.pdf

//http://csl.anthropomatik.kit.edu/downloads/vorlesungsinhalte/MMMK-PP07-DSP2-SS2013.pdf

//https://en.wikipedia.org/wiki/Mel_scale

//https://en.wikipedia.org/wiki/Window_function#Triangular_window

//https://github.com/vail-systems

