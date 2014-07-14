var utils = utils || {};
utils.gui = {};

utils.interPolateValues = function interPolateValues (values, value) {
	for (var k = 0; k < values.length; k++) {
		if (values.min <= value && values.max >= value) {
			return this.interPolate(values.start, values.end, this.normalizeValue(value, values.min, values.max));
		}
	}
	return 0;
};

utils.interPolate = function interPolate (start, end, value) {
	return start + (end - start) * value;
};

utils.normalizeDefaults = function normalizeDefaults (target, defaults) {
	var normalized = {};
	target = target || {};
	for (var k in defaults) {
		if (typeof defaults[k] === "object") {
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
	button.addEventListener("click", clickcallback);
	return button;
};