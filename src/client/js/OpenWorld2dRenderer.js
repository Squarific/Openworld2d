function OpenWorld2dRenderer (container, settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.container = container;
	this.initContainer(this.container);
	window.addEventListener("resize", this.resizeMapCanvas.bind(this));
	this.resizeMapCanvas();
}

OpenWorld2dRenderer.prototype.defaultSettings = {
	mapGradient: [{
		min: -0.98,
		max: -0.055,
		start: [65, 75, 153],
		end: [91, 184, 228]
	}, {
		min: -0.04,
		max: -0.01,
		start: [238, 238, 63],
		end: [241, 241, 63]
	}, {
		min: 0.012,
		max: 1.02,
		start: [137, 235, 61],
		end: [34, 167, 28]
	}]
};

OpenWorld2dRenderer.prototype.data = {
	lastMapRender: {
		position: [0, 0],
		size: [0, 0]
	}
};

OpenWorld2dRenderer.prototype.initContainer = function initContainer (container) {
	utils.removeChildren(container);
	this.mapCanvas = container.appendChild(document.createElement("canvas"));
	this.ctx = this.mapCanvas.getContext("2d");
};

OpenWorld2dRenderer.prototype.draw = function draw (openWorld2d, camera) {
	this.renderMap(openWorld2d.heightMap, camera);
};

OpenWorld2dRenderer.prototype.mapWidthChanged = function widthChanged (size) {
	if (size[0] !== this.mapCanvas.width || size[1] !== this.mapCanvas.height) {
		return true;
	}
	return false;
};

OpenWorld2dRenderer.prototype.mapMovedTooFar = function mapMovedTooFar (lastPosition, camera) {
	if (Math.abs(lastPosition[0] - camera.centerX) > this.mapCanvas.width / 2 ||
	    Math.abs(lastPosition[1] - camera.centerY) > this.mapCanvas.height / 2) {
		return true;
	}
	return false;
};

OpenWorld2dRenderer.prototype.renderMap = function (heightMap, camera) {
	if (this.mapWidthChanged(this.data.lastMapRender.size) || this.mapMovedTooFar(this.data.lastMapRender.position, camera)) {
		this.renderFullMap(heightMap, camera);
		this.data.lastMapRender.position[0] = camera.centerX;
		this.data.lastMapRender.position[1] = camera.centerY;
	} else {
		var shiftX = Math.round(this.data.lastMapRender.position[0] - camera.centerX),
			shiftY = Math.round(this.data.lastMapRender.position[1] - camera.centerY);
		this.shiftMap(shiftX, shiftY);
		if (shiftX > 0) {
			this.renderPartialMap(heightMap, [0, 0], [shiftX, this.mapCanvas.height], camera);
		}
		if (shiftX < 0) {
			this.renderPartialMap(heightMap, [this.mapCanvas.width + shiftX, 0], [this.mapCanvas.width, this.mapCanvas.height], camera);
		}
		if (shiftY > 0) {
			this.renderPartialMap(heightMap, [0, 0], [this.mapCanvas.width, shiftY], camera);
		}
		if (shiftY < 0) {
			this.renderPartialMap(heightMap, [0, this.mapCanvas.height + shiftY], [this.mapCanvas.width, this.mapCanvas.height], camera);
		}
		this.data.lastMapRender.position[0] = this.data.lastMapRender.position[0] - shiftX;
		this.data.lastMapRender.position[1] = this.data.lastMapRender.position[1] - shiftY;
	}
	this.data.lastMapRender.size[0] = this.mapCanvas.width;
	this.data.lastMapRender.size[1] = this.mapCanvas.height;
};

OpenWorld2dRenderer.prototype.shiftMap = function shiftMap (shiftX, shiftY) {
	if (shiftX == 0 && shiftY == 0) return;
	var imageData = this.ctx.getImageData(0, 0, this.mapCanvas.width, this.mapCanvas.height);
	this.ctx.putImageData(imageData, shiftX, shiftY);
};

OpenWorld2dRenderer.prototype.renderPartialMap = function renderPartialMap (heightMap, start, end, camera) {
	if (start[0] > end[0]) {
		var temp = end[0];
		end[0] = start[0];
		start[0] = temp;
	}
	if (start[1] > end[1]) {
		var temp = end[1];
		end[1] = start[1];
		start[1] = temp;
	}
	var width = end[0] - start[0],
		height = end[1] - start[1];
	var imageData = this.ctx.getImageData(start[0], start[1], width, height),
	    leftTopX = camera.centerX - this.mapCanvas.width / 2 + start[0],
	    leftTopY = camera.centerY - this.mapCanvas.height / 2 + start[1];
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var pixel = x * 4 + y * width * 4;
			var color = utils.colorFromGradient(this.settings.mapGradient, heightMap.getHeight((leftTopX + x) / camera.zoom, (leftTopY + y) / camera.zoom));
			imageData.data[pixel    ] = color[0];
			imageData.data[pixel + 1] = color[1];
			imageData.data[pixel + 2] = color[2];
			imageData.data[pixel + 3] = 255;
		}
	}
	this.ctx.putImageData(imageData, start[0], start[1]);
};

OpenWorld2dRenderer.prototype.renderFullMap = function renderMap (heightMap, camera) {
	var imageData = this.ctx.getImageData(0, 0, this.mapCanvas.width, this.mapCanvas.height),
	    leftTopX = camera.centerX - this.mapCanvas.width / 2,
	    leftTopY = camera.centerY - this.mapCanvas.height / 2;
	for (var x = 0; x < this.mapCanvas.width; x++) {
		for (var y = 0; y < this.mapCanvas.height; y++) {
			var pixel = x * 4 + y * this.mapCanvas.width * 4;
			var color = utils.colorFromGradient(this.settings.mapGradient, heightMap.getHeight((leftTopX + x) / camera.zoom, (leftTopY + y) / camera.zoom));
			imageData.data[pixel    ] = color[0];
			imageData.data[pixel + 1] = color[1];
			imageData.data[pixel + 2] = color[2];
			imageData.data[pixel + 3] = 255;
		}
	}
	this.ctx.putImageData(imageData, 0, 0);
};

OpenWorld2dRenderer.prototype.resizeMapCanvas = function resizeMapCanvas () {
	this.mapCanvas.width = this.container.offsetWidth;
	this.mapCanvas.height = this.container.offsetHeight;
};