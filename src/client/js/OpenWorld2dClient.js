function OpenWorld2dClient (container) {
	this.container = container;
	this.openView("mainStartMenu");
}

OpenWorld2dClient.prototype.camera = {
	centerX: 0,
	centerY: 0,
	zoom: 1
};

OpenWorld2dClient.prototype.gameLoop = function gameLoop () {
	this.openWorld2d.updateWorld();
	this.openWorld2dRenderer.draw(this.openWorld2d, this.camera);
	if (this.keepLooping) {
		requestAnimationFrame(this.gameLoop.bind(this));
	}
};

OpenWorld2dClient.prototype.newSinglePlayerGame = function newSinglePlayerGame () {
	if (!this.keepLooping) {
		this.openWorld2d = new OpenWorld2d;
		this.openWorld2dRenderer = new OpenWorld2dRenderer(this.container);
		this.startLoop();
	}
};

OpenWorld2dClient.prototype.startLoop = function startLoop () {
	requestAnimationFrame(this.gameLoop.bind(this));
	this.keepLooping = true;
};

OpenWorld2dClient.prototype.openView = function openView (viewName) {
	if (typeof this.views[viewName] === "function") {
		this.views[viewName](this);
	} else {
		console.log("View doesn't exist: ", viewName);
	}
};

OpenWorld2dClient.prototype.views = {
	mainStartMenu: function (openworld2dclient) {
		utils.removeChildren(openworld2dclient.container);
		openworld2dclient.container.classname = "mainmenu";
		openworld2dclient.container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "New singleplayer game"
		}, function () {
			openworld2dclient.newSinglePlayerGame();
		}));
		openworld2dclient.container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Load singleplayer game"
		}, function () {
			openworld2dclient.openView("singleplayersavegames");
		}));
		openworld2dclient.container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Multiplayer"
		}, function () {
			openworld2dclient.openView("multiplayer");
		}));
		openworld2dclient.container.appendChild(utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Credits"
		}, function () {
			openworld2dclient.openView("credits");
		}));
	}
};