Math.tau = Math.tau || (Math.PI*2);

var Pixels = (function(){
	
	var rgba = function(color) {return 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';};

	var Canvas = function(id,width,height,data) {
		var element = this.element = document.getElementById(id);
		element.style.width = width?width+'px':'100%';
		element.style.height = height?height+'px':'100%';
		width = width || element.innerWidth;
		height = height || element.innerHeight;
		element.width = this.width = width;
		element.height = this.height = height;
		this.width = width;
		this.height = height;
		this.context = this.element.getContext('2d');
		this.buffer = this.context.getImageData(0,0,this.width,this.height);
		this._stack = [];
		if(data instanceof Uint8ClampedArray) {
			for(var i=0;i<data.length;i++) {
				this.buffer.data[i] = data[i];
			}
			this.render();
		}
		
	};

	Canvas.prototype.put = function(x,y,color) {
		var data = this.buffer.data;
		var offset = (this.width * y + x) * 4;
		data[offset]   = color.r;
		data[offset+1] = color.g;
		data[offset+2] = color.b;
		data[offset+3] = color.a;
	};

	Canvas.prototype.get = function(x,y) {
		var data = this.buffer.data;
		var color = {};
		var offset = (this.width * y + x) * 4;
		color.r = data[offset  ];
		color.g = data[offset+1];
		color.b = data[offset+2];
		color.a = data[offset+3];
		return color;
	};

	//Pushes the current buffer onto the stack
	Canvas.prototype.push = function() {
		var temp = this.context.getImageData(0,0,this.width,this.height);
		this._stack.push(temp);
	};

	//Pops the top buffer from the stack to the current buffer
	Canvas.prototype.pop = function() {
		this.buffer = this._stack.pop();
		this.render();
		return this.buffer.data;
	};

	//Copies the top buffer from the stack to the current buffer
	Canvas.prototype.pull = function() {
		this.pop();
		this.render();
		this.push();
		return this.buffer.data;
	};

	//Returns a subarray of the buffer data
	Canvas.prototype.sub = function(x1,y1,x2,y2) {
		var offset1 = (this.width * y1 + x1) * 4;
		var offset2 = (this.width * y2 + x2) * 4;
		return this.buffer.data.subarray(offset1,offset2);
	};

	Canvas.prototype.gesso = function(color) {
		this.context.fillStyle=color||"rgba(255,255,255,255)";
		this.context.fillRect(0,0,this.width,this.height);
		this.buffer = this.context.getImageData(0,0,this.width,this.height);
	};

	Canvas.prototype.clear = function() {
		this.context.clearRect(0,0,this.width,this.height);
		this.buffer = this.context.getImageData(0,0,this.width,this.height);
	};


	Canvas.prototype.render = function() {
		this.context.putImageData(this.buffer,0,0);
	};

	return function(id,width,height,data){
		return new Canvas(id,width,height,data);
	};

})();