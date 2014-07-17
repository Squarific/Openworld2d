function OpenWorld2dRenderer (container, settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.container = container;
	this.initContainer(this.container);
	this.checkResize();
	this.data = {
		lastMapRender: {
			position: [0, 0],
			size: [0, 0],
			zoom: 0
		}
	};
}

OpenWorld2dRenderer.prototype.defaultSettings = {
	mapGradient: [{
		min: -0.98,
		max: -0.005,
		start: [65, 75, 153],
		end: [91, 184, 228] //Water
	}, {
		min: 0,
		max: 0.01,
		start: [238, 238, 63],
		end: [241, 241, 63] //Sand
	}, {
		min: 0.014,
		max: 0.45,
		start: [137, 235, 61],
		end: [34, 167, 28] //Grass
	}, {
		min: 0.52,
		max: 0.58,
		start: [172, 138, 50],
		end: [139, 114, 47] //Dirt
	}, {
		min: 0.62,
		max: 0.75,
		start: [129, 129, 129],
		end: [192, 192, 192] //Stone
	}, {
		min: 0.79,
		max: 1.02,
		start: [225, 225, 225],
		end: [255, 255, 255] //Snow
	}],
	shade: true
};

OpenWorld2dRenderer.prototype.speedTest = function speedTest (heightMap) {
	var timePerPixel = Date.now(),
		pixels = this.mapCanvas.width * this.mapCanvas.height;
	for (var k = 0; k < 1000; k++) {
		heightMap.getHeight(k, k);
	}
	timePerPixel = (Date.now() - timePerPixel) / 200; //We did 1000 and there are 5 per pixel
	if (timePerPixel * pixels > 15000) {
		this.settings.shade = false;
	}
};

OpenWorld2dRenderer.prototype.initContainer = function initContainer (container) {
	utils.removeChildren(container);
	this.mapCanvas = container.appendChild(document.createElement("canvas"));
	this.mapCtx = this.mapCanvas.getContext("2d");
};

OpenWorld2dRenderer.prototype.draw = function draw (openWorld2d, camera) {
	this.checkResize();
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
	if (this.mapWidthChanged(this.data.lastMapRender.size)
	|| this.mapMovedTooFar(this.data.lastMapRender.position, camera)
	|| this.data.lastMapRender.zoom !== camera.zoom
	|| this.data.lastMapRender.shade !== this.settings.shade) {
		this.renderFullMap(heightMap, camera, this.mapCtx);
		this.data.lastMapRender.position[0] = camera.centerX;
		this.data.lastMapRender.position[1] = camera.centerY;
	} else {
		var shiftX = Math.round((this.data.lastMapRender.position[0] - camera.centerX) * camera.zoom),
			shiftY = Math.round((this.data.lastMapRender.position[1] - camera.centerY) * camera.zoom);
		this.shiftMap(shiftX, shiftY, this.mapCtx);
		if (shiftX > 0) {
			this.renderPartialMap(heightMap, [0, 0], [shiftX, this.mapCanvas.height], camera, this.mapCtx);
		}
		if (shiftX < 0) {
			this.renderPartialMap(heightMap, [this.mapCanvas.width + shiftX, 0], [this.mapCanvas.width, this.mapCanvas.height], camera, this.mapCtx);
		}
		if (shiftY > 0) {
			this.renderPartialMap(heightMap, [0, 0], [this.mapCanvas.width, shiftY], camera, this.mapCtx);
		}
		if (shiftY < 0) {
			this.renderPartialMap(heightMap, [0, this.mapCanvas.height + shiftY], [this.mapCanvas.width, this.mapCanvas.height], camera, this.mapCtx);
		}
		this.data.lastMapRender.position[0] = this.data.lastMapRender.position[0] - shiftX / camera.zoom;
		this.data.lastMapRender.position[1] = this.data.lastMapRender.position[1] - shiftY / camera.zoom;
	}
	this.data.lastMapRender.size[0] = this.mapCanvas.width;
	this.data.lastMapRender.size[1] = this.mapCanvas.height;
	this.data.lastMapRender.zoom = camera.zoom;
	this.data.lastMapRender.shade = this.settings.shade;
};

OpenWorld2dRenderer.prototype.shiftMap = function shiftMap (shiftX, shiftY, ctx) {
	if (shiftX == 0 && shiftY == 0) return;
	var imageData = ctx.getImageData(0, 0, this.mapCanvas.width, this.mapCanvas.height);
	ctx.putImageData(imageData, shiftX, shiftY);
};

OpenWorld2dRenderer.prototype.renderPartialMap = function renderPartialMap (heightMap, start, end, camera, ctx) {
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
	var imageData = ctx.getImageData(start[0], start[1], width, height),
	    leftTopX = camera.centerX - ctx.canvas.width / 2 / camera.zoom + start[0] / camera.zoom,
	    leftTopY = camera.centerY - ctx.canvas.height / 2 / camera.zoom + start[1] / camera.zoom;
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			var pixel = x * 4 + y * width * 4;
			var pixelHeight = heightMap.getHeight(leftTopX + (x / camera.zoom), leftTopY + (y / camera.zoom));
			var color = utils.colorFromGradient(this.settings.mapGradient, pixelHeight);
			if (this.settings.shade) {
				color = this.shadeMapColor(heightMap, color, leftTopX + (x / camera.zoom), leftTopY + (y / camera.zoom));
			}
			imageData.data[pixel    ] = color[0];
			imageData.data[pixel + 1] = color[1];
			imageData.data[pixel + 2] = color[2];
			imageData.data[pixel + 3] = 255;
		}
	}
	ctx.putImageData(imageData, start[0], start[1]);
};

OpenWorld2dRenderer.prototype.renderFullMap = function renderMap (heightMap, camera, ctx) {
	this.renderPartialMap(heightMap, [0, 0], [ctx.canvas.width, ctx.canvas.height], camera, ctx);
};

OpenWorld2dRenderer.prototype.shadeMapColor = function shadeMapColor (heightMap, color, x, y) {
	var dx = heightMap.getHeight(x + 1, y) - heightMap.getHeight(x - 1, y);
	var dy = heightMap.getHeight(x, y + 1) - heightMap.getHeight(x, y - 1);
	var f = 1 + (dx + dy) * 5;
	for (var c = 0; c < color.length; c++) {
		color[c] = f * color[c];
	}
	return color;
};

OpenWorld2dRenderer.prototype.checkResize = function checkResize () {
	if (this.mapCanvas.width !== this.container.offsetWidth || this.mapCanvas.height !== this.container.offsetHeight) {
		this.mapCanvas.width = this.container.offsetWidth;
		this.mapCanvas.height = this.container.offsetHeight;
	}
};