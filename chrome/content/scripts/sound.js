function sound() {
	this.player = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
	this.player.init();

	this.ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

	this.enabled = true;

	this.IDLE = 2;
	this.DOT = 3;
	this.EXTRA = 4;
	this.DEATH = 5;
	this.EAT = 6;

	this.sounds = new Array();
	this.sounds[this.IDLE] = this.ioservice.newURI("chrome://pacman/skin/sounds/idle.wav", null, null);
	this.sounds[this.DOT] = this.ioservice.newURI("chrome://pacman/skin/sounds/dot.wav", null, null);
	this.sounds[this.EXTRA] = this.ioservice.newURI("chrome://pacman/skin/sounds/extra.wav", null, null);
	this.sounds[this.DEATH] = this.ioservice.newURI("chrome://pacman/skin/sounds/death.wav", null, null);
	this.sounds[this.EAT] = this.ioservice.newURI("chrome://pacman/skin/sounds/eat.wav", null, null);

	this.play = function(fx) {
		if(this.enabled == false)
			return;

		if(this.sounds[fx])
			this.player.play(this.sounds[fx]);
	}

	this.toggleSound = function() {
		this.enabled = !this.enabled;

		return this.enabled;
	}
}