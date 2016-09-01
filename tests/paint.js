;(function(){

	var noisy = new Noisy();

	var model = new Noisy.Model( { name:"commands" } );

	var sample = new Noisy.Sample( { name:"upcommand" , label:"up" } );
	
	console.log( noisy.id );

	console.log( model.id , model.name );

	console.log( sample.id , sample.name , sample.label );

	noisy.on( "up" , model , function(e) { console.log(e); } );

	var canvas = Pixels("stream",1024,1000);

	var y = 0;
	var paint = function(data) {
		for(var x=0;x<data.length;x++) {
			var c={r:255,g:50,b:50,a:Math.round(255*(data[x]/512))};
			canvas.put(x,y,c);
		}
		canvas.render();
		if (++y>=1000) y=0;
	};

	canvas.gesso();

	Noisy.Mic(paint);

	//noisy.listen();

})();