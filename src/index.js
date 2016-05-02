module.exports = function(){

	var DefaultReporter = function(logger){
		this.logger = logger;
	}

	DefaultReporter.prototype = {
		init: function(){

		}
	}

	var WeakMapProfiler = function(options){
		options = options || [];
		this.map = new WeakMap();
		this.metaMap = new Map();
		this.logger = options.logger || console.log.bind(console);
		this.reporter = options.reporter || new WeakMapProfiler.DefaultReporter(logger);
		this.reporter.init();
	}

	WeakMapProfiler.prototype = {
		log: function(key, value) {
			var valueRecords = this.metaMap.has(key) ? this.metaMap.get(key) : [];
			var record = {
				timestamp: performance.now(),
				alreadyLive: this.map.has(key)
			};
			valueRecords.push(record)
			this.metaMap.set(key, valueRecords);
			this.map.set(key, value);
		}
	}

	WeakMapProfiler.DefaultReporter = DefaultReporter;

	return WeakMapProfiler;
}();