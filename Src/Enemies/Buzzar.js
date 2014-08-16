Enemy.prototype.types['Buzzar'] =  function() {

	this.body.setSize(11, 27, 0, 0);

    this.animations.add('idle', ['Sting0000'], 10, true, false);
    this.animations.add('sting', ['Sting0001', 'Sting0002'], 10, false, false);

    this.state = Idling;

	this.updateFunction = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	

	////////////////////////////////STATES////////////////////////////////////
	function Idling() {
		this.PlayAnim('idle');
		
	};

};