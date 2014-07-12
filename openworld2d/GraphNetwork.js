function GraphNetwork (network) {
	this.network = {};
}

GraphNetwork.prototype.samePoint = function samePoint (point1, point2) {
	if (point1.x === point2.x && point1.y === point2.y) {
		return true;
	}
	return false;
};

GraphNetowrk.prototype.sameLine = function sameLine (line1, line2) {
	if ((this.samePoint(line1[0], line2[0]) && this.samePoint(line1[1], line2[1])) ||
		(this.samePoint(line1[1], line2[0]) && this.samePoint(line1[0], line2[1]))) {
		return true;
	}
	return false;
};

GraphNetwork.prototype.lineExists = function lineExists (line) {
	if (!this.network[line[0].x] || !this.network[line[0].x][line[0].y]) {
		return false;
	}
	for (var n = 0; n < this.network[line[0].x][line[0].y].length; n++) {
		if (this.sameLine(line, this.network[line[0].x][line[0].y][n])) {
			return true;
		}
	}
	return false;
};

GraphNetwork.prototype.addLine = function addLine (line) {
	if (!this.lineExists(line)) {
		this.addNode(line[0], line);
		this.addNode(line[1], line);
	}
};

GraphNetwork.prototype.addNode = function addNode (node, line) {
	this.network[node.x] = this.network[node.x] || {};
	this.network[node.x][node.y] = this.network[node.x][node.y] || [];
	this.network[node.x][node.y].push(line);
};

if (module && module.exports) {
	module.exports = HeightMap;
}