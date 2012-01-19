function pacman(wp) {
	this.startwaypoint = wp;
	this.currentwaypoint = this.startwaypoint;

	this.currentwaypoint.setPacman(this);

	this.direction = 0;
	this.new_direction = 0;
	this.prev_direction = 0;

	this.animstage = 1;

	this.moveLeft = function() {
		this.new_direction = 3;
	};

	this.moveRight = function() {
		this.new_direction = 1;
	};

	this.moveUp = function() {
		this.new_direction = 0;
	};

	this.moveDown = function() {
		this.new_direction = 2;
	};

	this.update = function() {
		var n = this.direction;

		switch(this.new_direction) {
			case 0:
				if(this.currentwaypoint.u)
					n = this.new_direction;
				break;
			case 1:
				if(this.currentwaypoint.r)
					n = this.new_direction;
				break;
			case 2:
				if(this.currentwaypoint.d)
					n = this.new_direction;
				break;
			case 3:
				if(this.currentwaypoint.l)
					n = this.new_direction;
				break;
			default:
				n = this.direction;
		}

		this.currentwaypoint.unsetPacman();

		switch(n) {
			case 0:
				if(this.currentwaypoint.u) {
					this.currentwaypoint = this.currentwaypoint.u;
					this.prev_direction = this.direction; 
					this.direction = n;
				}
				break;
			case 1:
				if(this.currentwaypoint.r) {
					this.currentwaypoint = this.currentwaypoint.r;
					this.prev_direction = this.direction; 
					this.direction = n;
				}
				break;
			case 2:
				if(this.currentwaypoint.d) {
					this.currentwaypoint = this.currentwaypoint.d;
					this.prev_direction = this.direction; 
					this.direction = n;
				}
				break;
			case 3:
				if(this.currentwaypoint.l) {
					this.currentwaypoint = this.currentwaypoint.l;
					this.prev_direction = this.direction; 
					this.direction = n;
				}
				break;
			default: break;
		}

		this.currentwaypoint.setPacman(this);

		this.animstage += 1;

		if(this.animstage > 1)
			this.animstage = 0;
	}

	this.hasGeist = function() {
		var g = null;

		g = this.currentwaypoint.geist;
		if(g != null && g.eatable == true)
			return g;

		if(this.currentwaypoint.u) {
			g = this.currentwaypoint.u.geist;
			if(g != null && g.eatable == true)
				return g;

			if(this.currentwaypoint.u.l) {
				g = this.currentwaypoint.u.l.geist;
				if(g != null && g.eatable == true)
					return g;
			}

			if(this.currentwaypoint.u.r) {
				g = this.currentwaypoint.u.r.geist;
				if(g != null && g.eatable == true)
					return g;
			}
		}

		if(this.currentwaypoint.r) {
			g = this.currentwaypoint.r.geist;
			if(g != null && g.eatable == true)
				return g;
		}

		if(this.currentwaypoint.d) {
			g = this.currentwaypoint.d.geist;
			if(g != null && g.eatable == true)
				return g;

			if(this.currentwaypoint.d.l) {
				g = this.currentwaypoint.d.l.geist;
				if(g != null && g.eatable == true)
					return g;
			}

			if(this.currentwaypoint.d.r) {
				g = this.currentwaypoint.d.r.geist;
				if(g != null && g.eatable == true)
					return g;
			}
		}

		if(this.currentwaypoint.l) {
			g = this.currentwaypoint.l.geist;
			if(g != null && g.eatable == true)
				return g;
		}

		return null;
	}

	this.setStartWaypoint = function(wp) {
		this.startwaypoint = wp;
	}

	this.reset = function() {
		this.currentwaypoint.unsetPacman();
		this.currentwaypoint = this.startwaypoint;
		this.currentwaypoint.setPacman(this);
		this.animstage = 1;
		this.direction = 0;
		this.new_direction = 0;
		this.prev_direction = 0;
	}
}