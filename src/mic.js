;(function(noisy) {
	"use strict";

	var context;
	var analyze;
	var analyser;
	var microphone;

	var listeners = [];

	var audiocontext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.msAudioContext;

	navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;

	var onStream = function(stream) {
		microphone = context.createMediaStreamSource(stream);
		analyser = context.createAnalyser();
		microphone.connect(analyser);
		requestAnimationFrame(analyze);
	};

	var onError = function(e) {
		console.error('No microphone!');
	};

	var analyzeFreqBatch = function() {
		analyser.fftSize=2048;
		var data = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(data);
		listeners.forEach(function(l){l(data)});
		requestAnimationFrame(analyze);
	};

	var listen = function(callback) {
		
		if (typeof callback === 'function') listeners.push(callback);

		if(!context) {
			context = new audiocontext();
			context.createGain = context.createGainNode;
			context.createDelay = context.createDelayNode;
			context.createScriptProcessor = context.createJavaScriptNode;

			analyze = analyzeFreqBatch;

			navigator.getUserMedia( {audio: true}, onStream, onError);
		}

	}

	noisy.Mic = listen;

})(this.Noisy);