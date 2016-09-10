;(function(noisy){
	"use strict";

	noisy.fftSize = 2048;

	var context;
	var analyze;
	var freqanalyser;
	var timeanalyser;
	var microphone;

	var listeners = [];

	var audiocontext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.msAudioContext;

	navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;

	var onStream = function(stream) {
		microphone = context.createMediaStreamSource(stream);
		freqanalyser = context.createAnalyser();
		timeanalyser = context.createAnalyser();
		freqanalyser.fftSize=noisy.fftSize;
		timeanalyser.fftSize=noisy.fftSize/2;
		microphone.connect(freqanalyser);
		microphone.connect(timeanalyser);
		requestAnimationFrame(analyze);
	};

	var onError = function(e) {
		console.error('No microphone!');
	};

	var analyzeBatch = function() {
		var freqdata = new Uint8Array(freqanalyser.frequencyBinCount);
		var timedata = new Uint8Array(timeanalyser.fftSize);
		freqanalyser.getByteFrequencyData(freqdata);
		timeanalyser.getByteTimeDomainData(timedata);
		listeners.forEach(function(l){l(freqdata,timedata)});
		requestAnimationFrame(analyze);
	};

	var listen = function(callback) {
		
		if (typeof callback === 'function') listeners.push(callback);

		if(!context) {
			context = new audiocontext();
			context.createGain = context.createGainNode;
			context.createDelay = context.createDelayNode;
			context.createScriptProcessor = context.createJavaScriptNode;

			analyze = analyzeBatch;

			navigator.getUserMedia( {audio: true}, onStream, onError);
		}

	}

	noisy.Mic = listen;

})(this.Noisy);