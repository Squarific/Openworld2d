function OpenWorld2d (container, settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.heightMap = new HeightMap(this.settings.map);
}

OpenWorld2d.prototype.defaultSettings = {
	map: {},
	tickTime: 1000 / 20
};

OpenWorld2d.prototype.updateWorld = function updateWorld (deltaTime) {
	
};

var module;
if (module && module.exports) {
	module.exports = OpenWorld2d;
}