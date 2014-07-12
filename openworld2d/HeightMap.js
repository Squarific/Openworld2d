function HeightMap (settings) {
	this.settings = this.normalizeDefaults(settings, this.defaultSettings);
	if (Perlin && this.settings.noiseType === "perlin") {
		this.noise = new Perlin(settings.seed).simplex2;
	} else if (typeof this.settings.noiseFunction === "function") {
		this.noise = this.settings.noiseFunction;
	} else {
		this.noise = function () {return 0;};
	}
}

HeightMap.prototype.getHeight = function getHeight (x, y) {
	return this.noise(x / this.settings.zoomX, y / this.settings.zoomY);
};

HeightMap.prototype.defaultSettings = {
	seed: Math.random(),
	zoomX: 1,
	zoomY: 1,
	noiseType: "perlin"
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

if (module && module.exports) {
	module.exports = HeightMap;
}