var OpenWorld2d = (function () {
	/*
		OpenWorld2d Constructor
	*/
	function OpenWorld2d (settings) {
		var defaultSettings = {
			drawing: {},
			update: {
				tickTime: 1000 / 20
			},
			network: {
				server: "http://defaultserver.com"
			}
		};
		
		this.settings = this.normalizeDefaults(settings, defaultSettings);
		this.data = {};
		this.saveListeners = [];
		
		if (typeof document !== "undefined" && typeof document.createElement === "function") {
			this.screen = new Screen(this.settings, this.data);
		}
	}
	
	OpenWorld2d.prototype.normalizeDefaults = function normalizeDefaults (target, defaults) {
		var normalized = {};
		for (var k in defaults) {
			if (typeof defaults[k] === "object") {
				normalized[k] = this.normalizeDefaults(target[k], defaults[k]);
			} else {
				normalized[k] = target[k] || defaults[k];
			}
		}
		return normalized;
	};

	OpenWorld2d.prototype.updateWorld = updateWorld () {
		
	};

	OpenWorld2d.prototype.listenToSave = function listenToSave (callback) {
		if (typeof callback !== "function") return;
		this.saveListeners.push(callback);
	};

	OpenWorld2d.prototype.save = function save (callback) {
		var errs = [],
		numberOfCallbacks = this.saveListeners.length,
		calledBack = 0;
		for (var fn = 0; fn < this.saveListeners.length; fn++) {
			this.saveListeners[fn](this.data, function (err) {
				if (err) errs.push(err);
				calledBack++;
				if (numberOfCallbacks <= calledBack) callback(errs);
			});
		}
	};
	
	/*
		Screen constructor
	*/
	
	function Screen (settings, data) {
		this.settings = settings;
		this.data = data;
		this.canvas = this.settings.drawing.canvas || document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
	}
	
	return OpenWorld2d;
})();

if (module && module.exports) {
	module.exports = OpenWorld2d;
}