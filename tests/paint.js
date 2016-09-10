;(function(){

	var noisy = new Noisy();

	var height = 1000;

	var doPaint = function() {
		var stream = Pixels("stream",Noisy.fftSize/2,height);
		stream.gesso();
		var y = 0;
		var paint = function(freqdata,timedata) {

			for(var x=0;x<freqdata.length;x++) {

				var c1={r:timedata[x],g:timedata[x],b:timedata[x],a:freqdata[x]};
				stream.put(x,y,c1);

			}

			stream.render();

			if (++y>=height) y=0;

		};

		Noisy.Mic(paint);
	}

	var doDCT = function() {
		var spectro = Pixels("spectro",Noisy.fftSize/2,height);
		spectro.gesso("#ffffff");
		var y2 = 0;
		var dctpaint = function(freqdata,timedata) {
			var coef = dct(freqdata);

			for(var x=0;x<freqdata.length;x++) {

				var c2={r:timedata[x],g:coef[x],b:freqdata[x],a:255};
				spectro.put(x,y2,c2);

			}

			spectro.render();

			if (++y2>=height) y2=0;		

		};

		Noisy.Mic(dctpaint);

	}

	var doMFCC = function() {
		var mspect = Pixels("mspect",Noisy.fftSize/2,height);
		mspect.gesso("#ffffff");

		var y3 = 0;
	    // Construct an MFCC with the characteristics we desire
	    var mfcc = construct(Noisy.fftSize/2,  // Number of expected FFT magnitudes
	                         Noisy.fftSize/4,    // Number of Mel filter banks
	                         300,   // Low frequency cutoff
	                         3500,  // High frequency cutoff
	                         8000); // Sample Rate (8khz)

		var mfccpaint = function(freqdata,timedata) {

		    // Run our MFCC on the FFT magnitudes
		    var coef = mfcc(freqdata);
		    var off = Math.floor((Noisy.fftSize/2)/coef.length);
			for(var x=0,c=0;x<Noisy.fftSize/2;x+=off,c++) {
				for(var i=0;i<off;i++) {
					var c3={r:coef[c],g:0,b:0,a:255};
					mspect.put(x+i,y3,c3);
				}
			}

			mspect.render();

			if (++y3>=height) y3=0;

		};

		Noisy.Mic(mfccpaint);
	}

	doMFCC();
	//doPaint();
	//doDCT();
	

})();