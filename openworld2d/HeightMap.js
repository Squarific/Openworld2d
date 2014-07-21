function HeightMap (settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	if (Perlin && this.settings.noiseType === "perlin") {
		this.noise = new Perlin(this.settings.seed).simplex2;
	} else if (typeof this.settings.noiseFunction === "function") {
		this.noise = this.settings.noiseFunction;
	} else {
		this.noise = function () {return 0;};
	}
}

HeightMap.prototype.getHeight = function getHeight (x, y) {
	return this.settings.shiftHeight((this.noise(x / this.settings.zoomX, y / this.settings.zoomY) + this.noise(x / this.settings.zoomX / 40, y / this.settings.zoomY / 40) * 24) / 25);	
};

HeightMap.prototype.defaultSettings = {
	seed: Math.random(),
	zoomX: 15,
	zoomY: 15,
	shiftHeight: function shiftHeight (height) {
		return height * height * height + 0.02;
	},
	noiseType: "perlin"
};

var module;
if (module && module.exports) {
	module.exports = HeightMap;
}