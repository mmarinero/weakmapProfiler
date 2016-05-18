module.exports = function(){

	var DefaultReporter = function(logger, interval){
		this.logger = logger;
	}

	DefaultReporter.prototype = {
		destroy : function(){
			clearInterval(this.intervalId);
		}
	}

	var WeakMapProfiler = function(options){
		options = options || [];
		this.references = new WeakMap();
		this.records = new Map();
		this.profiles = new Map();
		this.logger = options.logger || console.log.bind(console);
		if (options.reporter) {
			this.report = options.reporter.bind(this);
		}
		this.interval = options.interval !== undefined ? options.interval : 100
		setInterval(function() {
			var profile = new Map();
			this.records.forEach(function(valueRecords, key) {
				profile.set(key, {
					timestamp: performance.now(),
					live: this.references.has(key)
				});
			})
			this.profiles.set(performance.now(), profile);
		}, this.interval);
	}

	WeakMapProfiler.prototype = {
		add: function(key, value) {
			var valueRecords = this.records.has(key) ? this.records.get(key) : [];
			var record = {
				timestamp: performance.now(),
				alreadyLive: this.references.has(key)
			};
			valueRecords.push(record)
			this.records.set(key, valueRecords);
			this.references.set(key, value);
		},

		report: function(options){
			this.logger('Profile report at: ' + performance.now());
			if (options.valueHistory) {
				this.records.forEach(function(valueRecords, key){
					this.logger('key: ' + key.toString() + ' profile store history');
					if (options.valueHistory === 'full') {
						this.logger(valueRecords.toString());
					}
					this.logger('Stored now: ' + this.references.has(key));
				});
			}
			this.records.forEach(function(valueRecords, key){

			});
		}
	}

	WeakMapProfiler.DefaultReporter = DefaultReporter;

	return WeakMapProfiler;
}();