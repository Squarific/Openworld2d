function OpenWorld2dRenderer (container, settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.container = container;
	this.initContainer(this.container);
	window.addEventListener("resize", this.resizeCanvas.bind(this));
	this.resizeCanvas();
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

OpenWorld2dRenderer.prototype.initContainer = function initContainer (container) {
	utils.removeChildren(container);
	this.canvas = container.appendChild(document.createElement("canvas"));
	this.ctx = this.canvas.getContext("2d");
};

OpenWorld2dRenderer.prototype.draw = function draw (openWorld2d, camera) {
	this.renderMap(openWorld2d.heightMap, camera);
};

OpenWorld2dRenderer.prototype.renderMap = function renderMap (heightMap, camera) {
	var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
	    leftTopX = camera.centerX - this.canvas.width / 2,
	    leftTopY = camera.centerY - this.canvas.height / 2;
	for (var x = 0; x < this.canvas.width; x++) {
		for (var y = 0; y < this.canvas.height; y++) {
			var pixel = x * 4 + y * this.canvas.width * 4;
			var color = utils.colorFromGradient(this.settings.mapGradient, heightMap.getHeight((leftTopX + x) / camera.zoom, (leftTopY + y) / camera.zoom));
			imageData.data[pixel    ] = color[0];
			imageData.data[pixel + 1] = color[1];
			imageData.data[pixel + 2] = color[2];
			imageData.data[pixel + 3] = 255;
		}
	}
	this.ctx.putImageData(imageData, 0, 0);
};

OpenWorld2dRenderer.prototype.resizeCanvas = function resizeCanvas () {
	this.canvas.width = this.container.offsetWidth;
	this.canvas.height = this.container.offsetHeight;
};