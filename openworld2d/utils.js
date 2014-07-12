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

utils.normalizeValue = function normalizeValue (value, valuemin, valuemax) {
	return (value - valuemin) / (valuemax - valuemin);
};

utils.gui.createElement = function createElement (tag, elementpropertys) {
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

utils.gui.createButton = function createButton (elementpropertys, clickcallback) {
	var button = this.createElement("div", elementpropertys);
	button.addEventListener("click", clickcallback);
	return button;
};