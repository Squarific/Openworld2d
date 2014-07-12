var SQ = SQ || {};

SQ.AssetManager = function AssetManager (settings) {
	this.settings = settings;
	this.images = {};
	this.data = {};
	
	this.settings.step = (typeof this.settings.step === "function") ? this.settings.step : function () {};
	this.settings.success = (typeof this.settings.success === "function") ? this.settings.success : function () {};

	if (this.settings.assetsToLoad) {
		this.imagesToLoad = this.getLoadCount(this.settings.assetsToLoad.images);
		this.jsondataToLoad = this.getLoadCount(this.settings.assetsToLoad.jsondata);
		this.maxToLoad = this.imagesToLoad + this.jsondataToLoad;

		this.loadImages(this.images, this.settings.assetsToLoad.images);
		this.loadJsondata(this.data, this.settings.assetsToLoad.jsondata);
	}
};

SQ.AssetManager.prototype.getLoadCount = function getLoadCount (assets) {
	if (typeof assets !== "object") {
		return 1;
	}
	var toLoad = 0;
	for (var assetName in assets) {
		if (assets.hasOwnProperty(assetName)) {
			toLoad += this.getLoadCount(assets[assetName]);
		}
	}
	return toLoad;
};

SQ.AssetManager.prototype.loadImages = function loadImages (loadTo, loadImages) {
	for (var imageName in loadImages) {
		if (typeof loadImages[imageName] === "object") {
			loadTo[imageName] = {};
			this.loadImages(loadTo[imageName], loadImages[imageName]);
		} else {
			loadTo[imageName] = new Image();
			loadTo[imageName].addEventListener("load", this.imageLoadHandler.bind(this));
			loadTo[imageName].addEventListener("error", this.imageErrorHandler.bind(this));
			loadTo[imageName].src = loadImages[imageName];
		}
	}
};

SQ.AssetManager.prototype.loadJsondata = function loadJsondata (loadTo, loadJsondata) {
	for (var dataName in loadJsondata) {
		if (typeof loadJsondata[dataName] === "object") {
			loadTo[dataName] = {};
			this.loadJsondata(loadTo[dataName], loadJsondata[dataName]);
		} else {
			var request = new XMLHttpRequest();
			request.addEventListener("readystatechange", this.readystatechangeHandler.bind(this, dataName));
			request.open("GET", loadJsondata[dataName]);
			request.send();
		}
	}
};

SQ.AssetManager.prototype.imageLoadHandler = function imageLoadHandler (event) {
	this.imagesToLoad--;
	this.settings.step(this.imagesToLoad + this.jsondataToLoad, event);
	(this.imagesToLoad === 0 && this.jsondataToLoad === 0) ? this.settings.success() : "";
};

SQ.AssetManager.prototype.imageErrorHandler = function imageErrorHandler (event) {
	this.imagesToLoad--;
	this.settings.step(this.imagesToLoad + this.jsondataToLoad, event);
	this.settings.error(this.imagesToLoad + this.jsondataToLoad, event);
	(this.imagesToLoad === 0 && this.jsondataToLoad === 0) ? this.settings.success() : "";
};

SQ.AssetManager.prototype.readystatechangeHandler = function readystatechangeHandler (dataName, event) {
	if (event.target.readyState === 4) {
		this.jsondataToLoad--;
		if (event.target.status === 200) {
			this.data[dataName] = JSON.parse(event.target.responseText);
			this.settings.step(this.imagesToLoad + this.jsondataToLoad, event);
		} else {
			this.settings.step(this.imagesToLoad + this.jsondataToLoad, event);
			this.settings.error(this.imagesToLoad + this.jsondataToLoad, event);
		}
		(this.imagesToLoad === 0 && this.jsondataToLoad === 0) ? this.settings.success() : "";
	}
};