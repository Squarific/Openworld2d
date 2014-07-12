var SQ = SQ || {};

SQ.LoadingScreen = function LoadingScreen (theme) {
	this.domLoadingScreen = document.createElement("div");
	this.loadingBarContainer = this.domLoadingScreen.appendChild(document.createElement("div"));
	this.loadingBar = this.loadingBarContainer.appendChild(document.createElement("div"));
	this.message = this.loadingBarContainer.appendChild(document.createElement("div"));

	this.domLoadingScreen.classList.add("loadingscreen_" + theme + "_screen");
	this.loadingBarContainer.classList.add("loadingscreen_" + theme + "_loadingbarcontainer");
	this.loadingBar.classList.add("loadingscreen_" + theme + "_loadingbar");
	this.message.classList.add("loadingscreen_" + theme + "_message");

	this.loadingBar.style.width = "0%";
};

SQ.LoadingScreen.prototype.setMessage = function setMessage (message) {
	this.message.innerHTML = message;
};

SQ.LoadingScreen.prototype.setBar = function setBar (decimal) {
	this.loadingBar.style.width = (decimal * 100) + "%";
};

SQ.LoadingScreen.prototype.addToDom = function addToDom () {
	this.removeFromDom();
	document.body.appendChild(this.domLoadingScreen);
};

SQ.LoadingScreen.prototype.removeFromDom = function addToDom () {
	if (this.domLoadingScreen.parentNode && typeof this.domLoadingScreen.parentNode.removeChild === "function") {
		this.domLoadingScreen.parentNode.removeChild(this.domLoadingScreen);
	}
};