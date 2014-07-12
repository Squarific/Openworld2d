var requires = ["GraphNetwork", "Perlin", "HeightMap", "utils", "OpenWorld2d", "requestAnimationFrame"];

for (var req = 0; req < requires.length; req++) {
	if (typeof this[requires[req]] == "undefined") {
		throw "Requirement not loaded: " + requires[req];
	}
}

document.addEventListener("load", function () {
	var openworld2dclient = new OpenWorld2dClient(document.getElementById("openworld2d_container"));
})