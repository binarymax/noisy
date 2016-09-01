;(function(){

	var noisy = new Noisy();

	var model = new Noisy.Model( { name:"commands" } );

	var sample = new Noisy.Sample( { name:"upcommand" , label:"up" } );
	
	console.log( noisy.id );

	console.log( model.id , model.name );

	console.log( sample.id , sample.name , sample.label );

	noisy.on( "up" , model , function(e) { console.log(e); } );

	var cut = function(top,bot,width,height,canvas){
		for(var y=top;y<bot;y++) {
			for(var x=0;x<width;x++) {
				canvas.put(x,y,{r:50,g:50,b:180,a:255});
			}
		}
		canvas.render();
	};

	var split = function(width,height,tolerance,tolsize,gapsize,canvas) {
		var gap = 0;
		var lst = 0;
		for(var y=0;y<height;y++){
			var tol = 0;
			for(var x=0;x<width;x++){
				var c = canvas.get(x,y);
				if (c.a>tolerance) tol++;
			}
			if (tol<gapsize) {
				gap++;
			} else if (gap>=gapsize && y-lst>gapsize*2) {
				cut(y-gap,y,width,height,canvas);
				gap=0;
				lst=y;
			} else {
				gap=0;	
			}
		}
		
	};

	var paint = function(){
		var y = 0;

		var width   = 1024;
		var height  = 512;		

		var capture = true;

		var tolerance = 10;
		var tolsize = 50;
		var gapsize = 2;

		var canvas  = Pixels("stream",width,height);
		canvas.gesso();

		return function(data) {
			if(capture) {
				for(var x=0;x<data.length;x++) {
					var c={r:255,g:50,b:50,a:Math.round(255*(data[x]/512))};
					canvas.put(x,y,c);
				}

				canvas.render();

				if (++y>=height) {
					capture = false;
					split(width,height,tolerance,tolsize,gapsize,canvas);
				}

			}
		}
	}();

	Noisy.Mic(paint);

	//noisy.listen();

})();