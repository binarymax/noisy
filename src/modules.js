;(function(global){
	global.module = {};
	global.require = function(){};
	Object.defineProperty(global.module,'exports',{
		set:function(m) { 
			if (typeof m === 'function') {
				var str = m.toString();
				var name = str.substring(9,str.indexOf('(')).replace(/\s+/,'');
				global[name] = m;
			} else if (typeof m === 'object') {
				for (var p in m) {
					if (m.hasOwnProperty(p)){
						global[p] = m[p];
					}
				}
			}
		}
	});
})(this);