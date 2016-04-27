module.exports = function(){
	var WeakMapProfiler = function(logger){
		this.logger = logger;
		if (!this.logger) {
			this.logger = console.log.bind(console);
		}
		this.map = new WeakMap();
		this.metaMap = new Map();
	}

	WeakMapProfiler.prototype = {
		log: function(key, value) {
			this.map.set(key, value);
			this.metaMap.set(key, {
				timestamp: performance.now()
			})
		}
	}

	return WeakMapProfiler;
}();