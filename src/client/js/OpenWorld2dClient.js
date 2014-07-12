function OpenWorld2dClient (container) {
	this.container = container;
	this.openWorld2d = new OpenWorld2d();
	this.openWorld2dRenderer = new OpenWorld2dRenderer(container);
	this.openView("mainstartmenu");
}

OpenWorld2dClient.prototype.camera = {
	centerX: 0,
	centerY: 0,
	zoom: 1
};

OpenWorld2dClient.prototype.gameLoop = function gameLoop () {
	this.openWorld2d.updateWorld();
	this.openWorld2dRenderer.draw(this.openWorld2d, this.camera);
	this.draw();
	if (this.keepLooping) {
		requestAnimationFrame(this.gameLoop.bind(this));
	}
};

OpenWorld2dClient.prototype.startLoop = function startLoop () {
	requestAnimationFrame(this.gameLoop.bind(this));
	this.keepLooping = true;
};

OpenWorld2dClient.prototype.openView = function openView (viewName) {
	if (typeof this.views[viewName] === "function") {
		this.views[viewName](this);
	}
};

OpenWorld2dClient.prototype.views = {
	mainStartMenu: function (openworld2dclient) {
		this.canvas.style.display = "none";
		container.classname = "mainmenu";
		container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "New singleplayer game"
		}, openworld2dclients.newSinglePlayerGame));
		container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Load singleplayer game"
		}, function () {
			openworld2dclients.openView("singleplayersavegames");
		}));
		container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Multiplayer"
		}, function () {
			openworld2dclients.openView("multiplayer");
		}));
		container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Credits"
		}, function () {
			openworld2dclients.openView("credits");
		}));
	}
};