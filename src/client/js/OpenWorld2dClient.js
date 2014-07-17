function OpenWorld2dClient (container, settings) {
	this.settings = utils.normalizeDefaults(settings, this.defaultSettings);
	this.container = container;
	this.openView("mainStartMenu");
}

OpenWorld2dClient.prototype.data = {
	lastMovePosition: [0, 0],
	lastMapPositionUpdate: Date.now(),
	moveMapX: 0,
	moveMapY: 0
};

OpenWorld2dClient.prototype.defaultSettings = {
	renderer: {},
	mapScrollSpeed: 0.1
};

OpenWorld2dClient.prototype.camera = {
	centerX: 0,
	centerY: 0,
	zoom: 1
};

OpenWorld2dClient.prototype.updateCameraPosition = function () {
	var now = Date.now(),
	    deltaTime = now - this.data.lastMapPositionUpdate;
	this.camera.centerX += this.data.moveMapX * this.settings.mapScrollSpeed * deltaTime;
	this.camera.centerY += this.data.moveMapY * this.settings.mapScrollSpeed * deltaTime;
	this.data.lastMapPositionUpdate = now;
};

OpenWorld2dClient.prototype.gameLoop = function gameLoop () {
	this.openWorld2d.updateWorld();
	this.updateCameraPosition();
	this.openWorld2dRenderer.draw(this.openWorld2d, this.camera);
	if (this.keepLooping) {
		requestAnimationFrame(this.gameLoop.bind(this));
	}
};

OpenWorld2dClient.prototype.newSinglePlayerGame = function newSinglePlayerGame () {
	if (!this.keepLooping) {
		this.openWorld2d = new OpenWorld2d;
		this.openWorld2dRenderer = new OpenWorld2dRenderer(this.container, this.settings.renderer);
		this.openWorld2dRenderer.mapCanvas.addEventListener("mousedown", this.handleMouseAndTouchDown.bind(this));
		this.openWorld2dRenderer.mapCanvas.addEventListener("touchstart", this.handleMouseAndTouchDown.bind(this));
		this.openWorld2dRenderer.mapCanvas.addEventListener("mousemove", this.handleMouseAndTouchMove.bind(this));
		this.openWorld2dRenderer.mapCanvas.addEventListener("touchmove", this.handleMouseAndTouchMove.bind(this));
		this.openWorld2dRenderer.mapCanvas.addEventListener("mouseup", this.handleMouseAndTouchUp.bind(this));
		this.openWorld2dRenderer.mapCanvas.addEventListener("touchend", this.handleMouseAndTouchUp.bind(this));
		document.addEventListener("keydown", this.handleKeydown.bind(this));
		document.addEventListener("keyup", this.handleKeyup.bind(this));
		this.startLoop();
	}
};

OpenWorld2dClient.prototype.handleMouseAndTouchDown = function handleMouseAndTouchDown (event) {
	this.data.lastMovePosition[0] = event.screenX || event.changedTouches[0].screenX;
	this.data.lastMovePosition[1] = event.screenY || event.changedTouches[0].screenY;
	this.moving = true;
	this.openWorld2dRenderer.mapCanvas.style.cursor = "move";
};

OpenWorld2dClient.prototype.handleMouseAndTouchMove = function handleMouseAndTouchMove (event) {
	if (this.moving) {
		this.camera.centerX += this.data.lastMovePosition[0] - (event.screenX || event.changedTouches[0].screenX);
		this.camera.centerY += this.data.lastMovePosition[1] - (event.screenY || event.changedTouches[1].screenY);
		this.data.lastMovePosition[0] = event.screenX || event.changedTouches[0].screenX;
		this.data.lastMovePosition[1] = event.screenY || event.changedTouches[0].screenY;
	}
};

OpenWorld2dClient.prototype.handleMouseAndTouchUp = function handleMouseAndTouchUp (event) {
	this.moving = false;
	this.openWorld2dRenderer.mapCanvas.style.cursor = "";
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
		
		var newSinglePlayerButton = utils.gui.createButton({
			className: "button mainmenubutton",
			innerText: "New singleplayer game"
		}, function () {
			openworld2dclient.newSinglePlayerGame();
		});
		
		var loadSinglePlayerButton = utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Load singleplayer game"
		}, function () {
			openworld2dclient.openView("singleplayersavegames");
		});
		
		var multiplayerButton = utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Multiplayer"
		}, function () {
			openworld2dclient.openView("multiplayer");
		});
		
		var creditsButton = utils.gui.createButton({
			className: "button disabledbutton mainmenubutton",
			innerText: "Credits"
		}, function () {
			openworld2dclient.openView("credits");
		});
		
		var mainMenuContainer = utils.gui.createElement("div", {
			className: "mainmenu"
		});
		
		mainMenuContainer.appendChild(newSinglePlayerButton);
		mainMenuContainer.appendChild(loadSinglePlayerButton);
		mainMenuContainer.appendChild(multiplayerButton);
		mainMenuContainer.appendChild(creditsButton);
		
		openworld2dclient.container.appendChild(mainMenuContainer);
		
		openworld2dclient.container.style.background = "rgb(198, 204, 151)";
	}
};

OpenWorld2dClient.prototype.handleKeydown = function handleKeydown (event) {
	console.log(event.keyCode);
	switch (event.keyCode) {
		case 37: //Left
			this.data.moveMapX = -1;
		break;
		case 38: //Up
			this.data.moveMapY = -1;
		break;
		case 39: //Right
			this.data.moveMapX = 1;
		break;
		case 40: //Down
			this.data.moveMapY = 1;
		break;
	}
};

OpenWorld2dClient.prototype.handleKeyup = function handleKeyup (event) {
	switch (event.keyCode) {
		case 37: //Left
			this.data.moveMapX = 0;
		break;
		case 38: //Up
			this.data.moveMapY = 0;
		break;
		case 39: //Right
			this.data.moveMapX = 0;
		break;
		case 40: //Down
			this.data.moveMapY = 0;
		break;
	}
};