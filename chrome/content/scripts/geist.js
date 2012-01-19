function geist(wp, id) {
	this.startwaypoint = wp;
	this.currentwaypoint = this.startwaypoint;
	this.id = id;

	this.currentwaypoint.setGeist(this);

	this.preferred_direction = -1;
	this.previous_direction = -1;

	this.directions_count = 0;
	this.directions = new Array(4);

	this.animstage = this.id % 2;
	this.prev_animstage = (this.animstage == 0) ? 1 : 0;

	this.pacman_wp1 = null;
	this.pacman_wp2 = null;
	this.pacman_dir = -1;

	this.inhouse = true;

	this.eatable = false;
	this.eatable_countdown = 0;

	this.searchPacman = function() {
		var wp = null;

		if(this.currentwaypoint.u) {
			wp = this.currentwaypoint.u;

			while(1) {
				if(wp.pacman != null || wp.ausgang == true) {
					this.pacman_wp1 = wp;
					return 0;
				}

				if(!wp.u)
					break;

				wp = wp.u;
			}
		}

		if(this.currentwaypoint.r) {
			wp = this.currentwaypoint.r;

			while(1) {
				if(wp.pacman != null || wp.ausgang == true) {
					this.pacman_wp1 = wp;
					return 1;
				}

				if(!wp.r)
					break;

				wp = wp.r;
			}
		}

		if(this.currentwaypoint.d) {
			wp = this.currentwaypoint.d;

			while(1) {
				if(wp.pacman != null || wp.ausgang == true) {
					this.pacman_wp1 = wp;
					return 2;
				}

				if(!wp.d)
					break;

				wp = wp.d;
			}
		}

		if(this.currentwaypoint.l) {
			wp = this.currentwaypoint.l;

			while(1) {
				if(wp.pacman != null || wp.ausgang == true) {
					this.pacman_wp1 = wp;
					return 3;
				}

				if(!wp.l)
					break;

				wp = wp.l;
			}
		}

		if(this.eatable) {
			this.pacman_wp1 = null;
			this.pacman_wp2 = null;

			return -1;
		}

		if(this.pacman_wp1) {
			wp = this.pacman_wp1.u;

			while(wp) {
				if(wp.pacman != null) {
					this.pacman_dir = 0;
					break;
				}

				wp = wp.u;
			}

			wp = this.pacman_wp1.r;

			while(wp) {
				if(wp.pacman != null) {
					this.pacman_dir = 1;
					break;
				}

				wp = wp.r;
			}

			wp = this.pacman_wp1.d;

			while(wp) {
				if(wp.pacman != null) {
					this.pacman_dir = 2;
					break;
				}

				wp = wp.d;
			}

			wp = this.pacman_wp1.l;

			while(wp) {
				if(wp.pacman != null) {
					this.pacman_dir = 3;
					break;
				}

				wp = wp.l;
			}

			this.pacman_wp2 = this.pacman_wp1;
			this.pacman_wp1 = null;
		}

		if(this.pacman_wp2 == this.currentwaypoint) {
			this.pacman_wp2 = null;
			var dir = this.pacman_dir;
			this.pacman_dir = -1;

			return dir;
		}

		return -1;
	}

	this.canGo = function(dir) {
		switch(dir) {
			case 0:
				if(!this.currentwaypoint.u.u)
					return true;

				if(this.currentwaypoint.u.u.geist != null)
					return false;

				if(!this.currentwaypoint.u.u.u)
					return true;

				if(this.currentwaypoint.u.u.u.geist != null)
					return false;

				return true;
			case 1:
				if(!this.currentwaypoint.r.r)
					return true;

				if(this.currentwaypoint.r.r.geist != null)
					return false;

				if(!this.currentwaypoint.r.r.r)
					return true;

				if(this.currentwaypoint.r.r.r.geist != null)
					return false;

				return true;
			case 2:
				if(!this.currentwaypoint.d.d)
					return true;

				if(this.currentwaypoint.d.d.geist != null)
					return false;

				if(!this.currentwaypoint.d.d.d)
					return true;

				if(this.currentwaypoint.d.d.d.geist != null)
					return false;

				return true;
			case 3:
				if(!this.currentwaypoint.l.l)
					return true;

				if(this.currentwaypoint.l.l.geist != null)
					return false;

				if(!this.currentwaypoint.l.l.l)
					return true;

				if(this.currentwaypoint.l.l.l.geist != null)
					return false;

				return true;
		}

		return false;
	}

	this.update = function() {
		var dir = this.searchPacman();
		if(dir != -1)
			this.preferred_direction = dir;

		if(this.eatable) {
			if(dir == -1)
				this.preferred_direction = -1;

			if(this.preferred_direction != -1) {
				switch(this.preferred_direction) {
					case 0:
						this.previous_direction = 2;
						break;
					case 1:
						this.previous_direction = 3;
						break;
					case 2:
						this.previous_direction = 0;
						break;
					case 3:
						this.previous_direction = 1;
						break;
				}
			}
		}

		this.directions_count = 0;
		this.directions[0] = -1;
		this.directions[1] = -1;
		this.directions[2] = -1;
		this.directions[3] = -1;

		if(this.currentwaypoint.u && this.previous_direction != 2) {
			if(this.canGo(0)) {
				this.directions[this.directions_count] = 0;
				this.directions_count++;
			}
		}

		if(this.currentwaypoint.r && this.previous_direction != 3) {
			if(this.canGo(1)) {
				this.directions[this.directions_count] = 1;
				this.directions_count++;
			}
		}

		if(this.currentwaypoint.d && this.previous_direction != 0) {
			if(this.canGo(2)) {
				this.directions[this.directions_count] = 2;
				this.directions_count++;
			}
		}

		if(this.currentwaypoint.l && this.previous_direction != 1) {
			if(this.canGo(3)) {
				this.directions[this.directions_count] = 3;
				this.directions_count++;
			}
		}

		var r = Math.floor(Math.random() * 100.0);
		var dir_index = r % this.directions_count;

		if(this.preferred_direction != -1) {
			if(this.directions[0] == this.preferred_direction)
				dir_index = 0;
			else if(this.directions[1] == this.preferred_direction)
				dir_index = 1;
			else if(this.directions[2] == this.preferred_direction)
				dir_index = 2;
			else if(this.directions[3] == this.preferred_direction)
				dir_index = 3;
			else
				this.preferred_direction = -1;
		}

		this.currentwaypoint.unsetGeist();

		switch(this.directions[dir_index]) {
			case 0: this.currentwaypoint = this.currentwaypoint.u; break;
			case 1: this.currentwaypoint = this.currentwaypoint.r; break;
			case 2: this.currentwaypoint = this.currentwaypoint.d; break;
			case 3: this.currentwaypoint = this.currentwaypoint.l; break;
		}

		this.currentwaypoint.setGeist(this);

		this.previous_direction = this.directions[dir_index];

		this.prev_animstage = this.animstage;
		this.animstage += 1;

		if(this.eatable == false) {
			switch(this.animstage) {
				case 1: this.animstage = 1; break;
				case 2: this.animstage = 0; break;
				case 3: this.animstage = 1; break;
				case 4: this.animstage = 0; break;
				case 5: this.animstage = 1; break;
				case 6: this.animstage = 0; break;
				default: this.animstage = 0; break;
			}
		}
		else {
			this.eatable_countdown--;

			if(this.eatable_countdown > 15) {
				switch(this.animstage) {
					case 1: this.animstage = 2; break;
					case 2: this.animstage = 3; break;
					case 3: this.animstage = 3; break;
					case 4: this.animstage = 2; break;
					case 5: this.animstage = 3; break;
					case 6: this.animstage = 2; break;
					default: this.animstage = 2; break;
				}
			}
			else {
				switch(this.animstage) {
					case 1: this.animstage = 2; break;
					case 2: this.animstage = 3; break;
					case 3: this.animstage = 5; break;
					case 4: this.animstage = 4; break;
					case 5: this.animstage = 2; break;
					case 6: this.animstage = 3; break;
				}
			}

			if(this.eatable_countdown <= 0)
				this.eatable = false;
		}
	}

	this.hasPacman = function() {
		var g = null;

		if(this.currentwaypoint.pacman != null)
			return true;

		if(this.currentwaypoint.u) {
			if(this.currentwaypoint.u.pacman != null)
				return true;

			if(this.currentwaypoint.u.l) {
				if(this.currentwaypoint.u.l.pacman != null)
					return true;
			}

			if(this.currentwaypoint.u.r) {
				if(this.currentwaypoint.u.r.pacman != null)
					return true;
			}
		}

		if(this.currentwaypoint.r) {
			if(this.currentwaypoint.r.pacman != null)
				return true;
		}

		if(this.currentwaypoint.d) {
			if(this.currentwaypoint.d.pacman != null)
				return true;

			if(this.currentwaypoint.d.l) {
				if(this.currentwaypoint.d.l.pacman != null)
					return true;
			}

			if(this.currentwaypoint.d.r) {
				if(this.currentwaypoint.d.r.pacman != null)
					return true;
			}
		}

		if(this.currentwaypoint.l) {
			if(this.currentwaypoint.l.pacman != null)
				return true;
		}

		return false;
	}

	this.setStartWaypoint = function(wp) {
		this.startwaypoint = wp;
	}

	this.setEatable = function() {
		if(!this.inhouse) {
			this.eatable = true;
			this.eatable_countdown = 60;

			this.pacman_wp1 = null;
			this.pacman_wp2 = null;
		}
	}

	this.reset = function() {
		this.currentwaypoint.unsetGeist();
		this.currentwaypoint = this.startwaypoint;
		this.currentwaypoint.setGeist(this);
		this.animstage = this.id % 2;
		this.prev_animstage = (this.animstage == 0) ? 1 : 0;
		this.preferred_direction = 0;
		this.previous_direction = -1;
		this.inhouse = true;
		this.eatable = false;
	}
}