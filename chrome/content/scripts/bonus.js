function bonus(wp) {
	this.waypoint = wp;
	this.bonus = false;
	this.bonus_timeout = true;
	this.last_bonus = 0;

	this.update = function() {
		if(this.bonus_timeout == true)
			return;

		var d = new Date();
		var t = d.getTime();

		if(t - this.last_bonus <= 20000)
			return;

		var z = (t % 10);
		if(z == 2 || z == 7) {
			this.bonus_timeout = true;
			this.bonus = true;
		}
	}

	this.start = function() {
		var d = new Date();
		this.last_bonus = d.getTime();
		this.bonus_timeout = false;
	}

	this.showBonus = function() {
		var b = this.bonus;
		this.bonus = false;
		return b;
	}
}