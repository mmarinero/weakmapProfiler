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
				profile.set(key,  this.references.has(key));
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

		clearProfiles: function() {
			this.profiles.clear();
		},

		report: function(options) {
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
			if (options.profile === undefined || options.profile){
				options.sample = options.sample || 1;
				var index = 0;
				this.profiles.forEach(function(profile, time){
					if ( index++ % options.sample !== 0 ) {
						return; //Skip profiles when sampling
					}
					this.logger('State at: ' + time);
					this.profile.foreach(function() {
						var live = 0;
						this.records.keys().forEach(function(key){
							if (options.profile === 'full'){
								var state = profile.has(key) ? 'live' : 'dead';
								this.logger('key: ' + key + 'was ' + state);
								liveReferences += 1;
							}
						});
						this.logger('live/total: ' + live /  this.profile.size());
					});
				});
			}
		}
	}

	WeakMapProfiler.DefaultReporter = DefaultReporter;

	return WeakMapProfiler;
}();