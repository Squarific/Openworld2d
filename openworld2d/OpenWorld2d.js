function OpenWorld2d (settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.heightMap = new HeightMap(this.settings.map);
	this.citys = new Citys(this.settings.citys);
}

OpenWorld2d.prototype.defaultSettings = {
	map: {},
	citys: {},
	tickTime: 1000 / 20
};

OpenWorld2d.prototype.updateWorld = function updateWorld (deltaTime) {
	
};

var module;
if (module && module.exports) {
	module.exports = OpenWorld2d;
}