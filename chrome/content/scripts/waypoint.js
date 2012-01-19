function waypoint(id, top, left, type) {
	this.top = top;
	this.left = left;
	this.id = id;
	this.type = type;

	this.passthrough = false;
	this.pacman = null;
	this.geist = null;
	this.ausgang = false;
	this.bonus = false;

	if(this.type == 9)
		this.ausgang = true;

	this.u = null;
	this.r = null;
	this.d = null;
	this.l = null;

	this.setNeighbours = function(up, right, down, left) {
		this.u = up;
		this.r = right;
		this.d = down;
		this.l = left;

		if(this.type == 6)
			this.l = null;
	}

	this.isNeighbour = function(top, left) {
		if(this.left == left) {
			if(this.top == (top - 1))
				return 0;

			if(this.top == (top + 1))
				return 2;
		}
		else if(this.top == top) {
			if(this.left == (left - 1))
				return 3;

			if(this.left == (left + 1))
				return 1;
		}

		return -1;
	}

	this.next = null;
	this.prev = null;

	this.setNextWaypoint = function(next) {
		this.next = next;
	}

	this.setPrevWaypoint = function(prev) {
		this.prev = prev;
	}

	this.findNeighbours = function() {
		var root = this;
		var node = null;

		while(root.prev)
			root = root.prev;

		var up = null;
		var right = null;
		var down = null;
		var left = null;

		var p = -1;
		node = root;
		while(node) {
			p = node.isNeighbour(this.top, this.left);

			switch(p) {
				case 0: up = node; break;
				case 1: right = node; break;
				case 2: down = node; break;
				case 3: left = node; break;
				default: break;
			}

			node = node.next;
		}

		if(this.type == 7) {
			node = root;
			while(root) {
				if(root.type == 8) {
					down = root;
					break;
				}
				root = root.next;
			}
		}

		if(this.type == 8) {
			node = root;
			while(root) {
				if(root.type == 7) {
					up = root;
					break;
				}
				root = root.next;
			}
		}

		this.setNeighbours(up, right, down, left);
	}

	this.setPacman = function(p) {
		this.pacman = p;

		if(this.u) {
			this.u.pacman = p;
/*
			if(this.u.r)
				this.u.r.pacman = p;

			if(this.u.l)
				this.u.l.pacman = p;
*/
		}

		if(this.r)
			this.r.pacman = p;

		if(this.d) {
			this.d.pacman = p;
/*
			if(this.d.r)
				this.d.r.pacman = p;

			if(this.d.l)
				this.d.l.pacman = p;
*/
		}

		if(this.l)
			this.l.pacman = p;
	}

	this.unsetPacman = function() {
		this.pacman = null;

		if(this.u) {
			this.u.pacman = null;
/*
			if(this.u.r)
				this.u.r.pacman = null;

			if(this.u.l)
				this.u.l.pacman = null;
*/
		}

		if(this.r)
			this.r.pacman = null;

		if(this.d) {
			this.d.pacman = null;
/*
			if(this.d.r)
				this.d.r.pacman = null;

			if(this.d.l)
				this.d.l.pacman = null;
*/
		}

		if(this.l)
			this.l.pacman = null;
	}

	this.setGeist = function(g) {
		this.geist = g;

		if(this.u) {
			this.u.geist = g;
/*
			if(this.u.r)
				this.u.r.geist = g;
			if(this.u.l)
				this.u.l.geist = g;
*/
			//if(this.u.u)
			//	this.u.u.geist = true;
		}

		if(this.r) {
			this.r.geist = g;

			//if(this.r.r)
			//	this.r.r.geist = true;
		}

		if(this.d) {
			this.d.geist = g;
/*
			if(this.d.r)
				this.d.r.geist = g;
			if(this.d.l)
				this.d.l.geist = g;
*/
			//if(this.d.d)
			//	this.d.d.geist = true;
		}

		if(this.l) {
			this.l.geist = g;

			//if(this.l.l)
			//	this.l.l.geist = true;
		}
	}

	this.unsetGeist = function() {
		this.geist = null;

		if(this.u) {
			this.u.geist = null;
/*
			if(this.u.r)
				this.u.r.geist = false;
			if(this.u.l)
				this.u.l.geist = false;
*/
			//if(this.u.u)
			//	this.u.u.geist = false;
		}

		if(this.r) {
			this.r.geist = null;

			//if(this.r.r)
			//	this.r.r.geist = false;
		}

		if(this.d) {
			this.d.geist = null;
/*
			if(this.d.r)
				this.d.r.geist = false;
			if(this.d.l)
				this.d.l.geist = false;
*/
			//if(this.d.d)
			//	this.d.d.geist = false;
		}

		if(this.l) {
			this.l.geist = null;

			//if(this.l.l)
			//	this.l.l.geist = false;
		}
	}
}