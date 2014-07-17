var utils = utils || {};
utils.gui = {};

/*
	gradient = [{
		min: 0,
		max: 0.5,
		start: [255, 255, 255],
		end: [111, 100, 0]
	}];
*/
utils.colorFromGradient = function (gradient, value) {
	for (var k = 0; k < gradient.length; k++) {
		if (gradient[k].min <= value && gradient[k].max >= value) {
			return this.interPolateMulti(gradient[k].start, gradient[k].end, this.normalizeValue(value, gradient[k].min, gradient[k].max));
		} else if (gradient[k + 1] && gradient[k + 1].min > value) {
			// If the next gradient is too hight, interpolate between two gradients
			return this.interPolateMulti(gradient[k].end, gradient[k + 1].start, this.normalizeValue(value, gradient[k].max, gradient[k + 1].min));
		}
	}
	throw "No color matched value: " + value + " gradient: " + JSON.stringify(gradient);
	return;
};

utils.interPolateValues = function interPolateValues (values, value) {
	for (var k = 0; k < values.length; k++) {
		if (values[k].min <= value && values[k].max >= value) {
			return this.interPolate(values[k].start, values[k].end, this.normalizeValue(value, values[k].min, values[k].max));
		}
	}
	return 0;
};

utils.interPolate = function interPolate (start, end, value) {
	return start + (end - start) * value;
};

utils.interPolateMulti = function interPolateMulti (starts, ends, value) {
	var interpolated = [];
	for (var k = 0; k < starts.length; k++) {
		interpolated[k] = this.interPolate(starts[k], ends[k], value);
	}
	return interpolated;
};

utils.cloneObject = function (obj) {
	var clone = {};
	for (var k in obj) {
		if (typeof obj[k] === "object" && !(obj[k] instanceof Array)) {
			clone[k] = this.cloneObject(obj[k]);
		} else {
			clone[k] = obj[k]
		}
	}
	return clone;
};

utils.normalizeDefaults = function normalizeDefaults (target, defaults) {
	target = target || {};
	var normalized = utils.cloneObject(target);
	for (var k in defaults) {
		if (typeof defaults[k] === "object" && !(defaults[k] instanceof Array)) {
			normalized[k] = this.normalizeDefaults(target[k] || {}, defaults[k]);
		} else {
			normalized[k] = target[k] || defaults[k];
		}
	}
	return normalized;
};

utils.normalizeValue = function normalizeValue (value, valuemin, valuemax) {
	return (value - valuemin) / (valuemax - valuemin);
};

utils.removeChildren = function removeChildren (element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

utils.gui.createElement = function createElement (tag, elementPropertys) {
	var element = document.createElement(tag);
	this.applyElementPropertys(element, elementPropertys);
	return element;
};

utils.gui.applyElementPropertys = function applyElementPropertys (element, propertys) {
	for (var k in propertys) {
		if (typeof propertys[k] === "object") {
			element[k] = element[k] || {};
			this.applyElementPropertys(element[k], propertys[k]);
		} else {
			element[k] = propertys[k];
		}
	}
	return element;
};

utils.gui.createButton = function createButton (elementPropertys, clickcallback) {
	var button = this.createElement("div", elementPropertys);
	button.addEventListener("click", function (event) {
		if (!event.target.classList.contains("disabledbutton")) {
			clickcallback();
		}
	});
	return button;
};