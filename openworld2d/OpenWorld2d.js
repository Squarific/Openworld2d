function OpenWorld2d (container, settings) {
	this.settings = this.normalizeDefaults(settings, this.defaultSettings);
	this.heightMap = new HeightMap(settings.map);
}

OpenWorld2d.prototype.defaultSettings = {
	map: {},
	tickTime: 1000 / 20
};

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

OpenWorld2d.prototype.updateWorld = updateWorld (deltaTime) {
	
};

if (module && module.exports) {
	module.exports = OpenWorld2d;
}