;(function(){

	

	var noisy = new Noisy();

	var model = new Noisy.Model( { name:"commands" } );

	var sample = new Noisy.Sample( { name:"upcommand" , label:"up" } );
	
	console.log( noisy.id );

	console.log( model.id , model.name );

	console.log( sample.id , sample.name , sample.label );

	noisy.on( "up" , model , function(e) { console.log(e); } );

	var Setting = function(id,value) {
		var self = this;
		this.id = id;
		this.element = document.getElementById(id);
		this.element.value = value;
		this.element.disabled = true;
		this.element.onchange = function(e){ isolate() };

		Object.defineProperty(this,"value",{
			get:function value(){ 
				return parseInt(self.element.value);
			}
		});

	};

	Setting.prototype.enable = function() {
		this.element.disabled = false;
	};

	var tolerance = new Setting("tolerance",20);
	var limit = new Setting("limit",200);
	var tolsize = new Setting("tolsize",60);
	var gapsize = new Setting("gapsize",2);

	var width   = 1024;
	var height  = 512;

	var canvas  = Pixels("stream",width,height);
	canvas.gesso();
	canvas.push();

	var block = function(top,bot,width,height){
		for(var y=top;y<bot;y++) {
			for(var x=0;x<width;x++) {
				canvas.put(x,y,{r:50,g:50,b:180,a:255});
			}
		}
		canvas.render();
	};

	var cut = function(top,bot,width,height){
		var sample = canvas.sub(0,top,0,bot).slice();
		var section = document.createElement("canvas");
		var secid = Noisy.id();
		section.setAttribute("id",secid);
		section.className="sample";
		document.body.appendChild(section);
		image = Pixels(secid,width,bot-top,sample);
		return image;
	};

	var split = function(width,height,tolerance,limit,tolsize,gapsize) {

		var gap = 0;
		var lst = 0;

		for(var y=0;y<height;y++){
			var tol = 0;
			var brk = 0;
			for(var x=0;x<width;x++){
				var c = canvas.get(x,y);
				if (c.a>limit) brk++;
				if (c.a>tolerance) tol++;

			}

			if (brk>0) {
				gap=0;
			} else if (tol<=tolsize) {
				gap++;
			} else if (gap>=gapsize && y-lst>50) {
				//block(y-gap,y,width,height);
				cut(lst,y-gap,width,height);
				gap=0;
				lst=y;
			} else {
				gap=0;	
			}
		}

		canvas.element.style.display = "none";
		
	};

	var isolate = function() {
		canvas.pull();
		console.log("isolating", tolerance.value , limit.value , tolsize.value , gapsize.value );
		split( width , height , tolerance.value , limit.value , tolsize.value , gapsize.value );
	};

	var enable = function() {
		tolerance.enable();
		limit.enable();
		tolsize.enable();
		gapsize.enable();
	}

	var y = 0;
	var capture = true;
	var paint = function(data) {
		if(capture) {
			for(var x=0;x<data.length;x++) {
				var c={r:255,g:50,b:50,a:data[x]};
				canvas.put(x,y,c);
			}

			canvas.render();

			if (++y>=height) {
				capture = false;
				//enable();
				//canvas.push();
				//isolate();
				split( width , height , tolerance.value , limit.value , tolsize.value , gapsize.value );
			}

		}
	};

	Noisy.Mic(paint);

})();