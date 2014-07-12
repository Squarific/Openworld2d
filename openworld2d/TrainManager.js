function TrainManager () {
	this.trains = [];
}

TrainManager.prototype.trainExists = function trainExists (train) {
	
};

TrainManager.prototype.addTrain = function addTrain (train) {
	if (!this.trainExists) {
		this.trains.push(train);
	}
};