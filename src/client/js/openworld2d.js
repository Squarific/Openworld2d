var requires = ["GraphNetwork", "Perlin", "HeightMap", "TrainManager", "utils", "OpenWorld2d", "requestAnimationFrame"];

for (var req = 0; req < requires.length; req++) {
	if (typeof this[requires[req]] == "undefined") {
		throw "Requirement not loaded: " + requires[req];
	}
}

var openworld2dclient = new OpenWorld2dClient(document.getElementById("openworld2d_container"));